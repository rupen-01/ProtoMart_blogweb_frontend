import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Upload,
  X,
  MapPin,
  LoaderCircle,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { photosAPI } from "../../api/photos.api";
import { placesAPI } from "../../api/places.api";
import { googlePhotosAPI } from "../../api/googlePhotos.api";
import toast from "react-hot-toast";
import axios from "axios";

const PhotoUpload = ({ onUploadSuccess }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const preselectedPlace = location.state?.place;
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState(null);
  const [returnPath, setReturnPath] = useState(null);

  const [places, setPlaces] = useState([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [newPlaceName, setNewPlaceName] = useState("");
  const [coordinates, setCoordinates] = useState(null);

  const [googleLink, setGoogleLink] = useState("");
  const [googleJob, setGoogleJob] = useState(null);
  const [googleSyncState, setGoogleSyncState] = useState("idle");
  const [googlePollingErrors, setGooglePollingErrors] = useState(0);
  const [googleJobError, setGoogleJobError] = useState(null);
  const [lastGoogleSyncPayload, setLastGoogleSyncPayload] = useState(null);
  const [experienceDate, setExperienceDate] = useState("");
  const [experiencePerson, setExperiencePerson] = useState("");
  const [uploadedByPerson, setUploadedByPerson] = useState("");
  const [experienceDescription, setExperienceDescription] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [manualLatitude, setManualLatitude] = useState("");
const [manualLongitude, setManualLongitude] = useState("");

  const fileInputRef = useRef(null);
  const googlePollTimeoutRef = useRef(null);

  // 🔹 Load existing places
  useEffect(() => {
    placesAPI.getAllPlaces({ limit: 1000 }).then((res) => {
      setPlaces(res.data || []);
    });

    // Handle preselected place
    if (preselectedPlace) {
      setSelectedPlaceId(preselectedPlace._id);
      setSelectedPlaceDetails(preselectedPlace);
      setReturnPath(`/places/${preselectedPlace._id}`);
      setCoordinates({
        latitude: preselectedPlace.coordinates[1],
        longitude: preselectedPlace.coordinates[0],
      });
      setExperienceDate("");
      setExperiencePerson("");
      setUploadedByPerson("");
      setExperienceDescription("");
      setZipCode("");
    }
  }, [preselectedPlace]);

  useEffect(() => {
    if (coordinates) {
      // Sync auto-detected coordinates to manual input fields
      setManualLatitude(coordinates.latitude.toString());
      setManualLongitude(coordinates.longitude.toString());
    }
  }, [coordinates]);

  useEffect(() => {
    if (
      !googleJob?.jobId ||
      !["starting", "processing"].includes(googleSyncState)
    ) {
      return undefined;
    }

    let cancelled = false;

    const pollProgress = async () => {
      try {
        const progressResponse = await googlePhotosAPI.getSyncProgress(
          googleJob.jobId
        );

        if (cancelled) {
          return;
        }

        setGooglePollingErrors(0);
        setGoogleJobError(null);
        setGoogleJob((prev) => ({
          ...(prev || {}),
          ...progressResponse,
        }));

        if (progressResponse.status === "completed") {
          setGoogleSyncState("completed");
          setGoogleLink("");
          toast.success(
            `Google Photos import completed. Uploaded ${progressResponse.results?.uploaded || 0} images.`
          );
          onUploadSuccess?.(progressResponse.results);
          return;
        }

        if (progressResponse.status === "failed") {
          setGoogleSyncState("failed");
          setGoogleJobError(progressResponse.error || "Import failed");
          toast.error(progressResponse.error || "Google Photos import failed");
          return;
        }

        setGoogleSyncState("processing");
        googlePollTimeoutRef.current = setTimeout(pollProgress, 2000);
      } catch (error) {
        if (cancelled) {
          return;
        }

        let nextCount = 1;
        setGooglePollingErrors((prev) => {
          nextCount = prev + 1;
          return nextCount;
        });
        setGoogleJobError("Connection issue while checking progress. Retrying...");
        googlePollTimeoutRef.current = setTimeout(
          pollProgress,
          Math.min(10000, 2000 * nextCount)
        );
      }
    };

    pollProgress();

    return () => {
      cancelled = true;
      if (googlePollTimeoutRef.current) {
        clearTimeout(googlePollTimeoutRef.current);
      }
    };
  }, [googleJob?.jobId, googleSyncState, onUploadSuccess]);

  // 🔹 File select
  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviews(
      selected.map((f) => ({
        url: URL.createObjectURL(f),
        type: f.type,
      }))
    );
  };

  // 🔹 Existing place selected
  const handlePlaceSelect = (placeId) => {
    setSelectedPlaceId(placeId);
    setNewPlaceName("");

    const place = places.find((p) => p._id === placeId);
    if (place?.location?.coordinates) {
      const coords = {
        latitude: place.location.coordinates[1],
        longitude: place.location.coordinates[0],
      };
      setCoordinates(coords);
      // Sync to manual inputs
      setManualLatitude(coords.latitude.toString());
      setManualLongitude(coords.longitude.toString());
    }
  };

  const geocodePlace = async () => {
    if (!newPlaceName) return;

    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: newPlaceName,
            format: "json",
            limit: 1,
          },
        }
      );

      if (!res.data.length) {
        toast.error("Place not found");
        return;
      }

      const coords = {
        latitude: parseFloat(res.data[0].lat),
        longitude: parseFloat(res.data[0].lon),
      };

      setCoordinates(coords);
      // Sync to manual inputs
      setManualLatitude(coords.latitude.toString());
      setManualLongitude(coords.longitude.toString());

      toast.success("Location detected");
    } catch {
      toast.error("Failed to detect location");
    }
  };

  const handleUpload = async () => {
    if (!files.length) return toast.error("Select files");
    if (!coordinates) return toast.error("Select or add a place");

    try {
      setUploading(true);
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("photo", file);
      });
      formData.append("latitude", coordinates.latitude);
      formData.append("longitude", coordinates.longitude);

      // ADD placeId if available
      if (selectedPlaceId) {
        formData.append("placeId", selectedPlaceId);
      }

      if (experienceDate) formData.append("experienceDate", experienceDate);
      if (experiencePerson)
        formData.append("experiencePerson", experiencePerson);
      if (uploadedByPerson)
        formData.append("uploadedByPerson", uploadedByPerson);
      if (experienceDescription)
        formData.append("experienceDescription", experienceDescription);
      if (zipCode) formData.append("zipCode", zipCode);
      const res = await photosAPI.uploadPhoto(formData);
      toast.success("Upload successful");

      setFiles([]);
      setPreviews([]);
      setSelectedPlaceId("");
      setNewPlaceName("");
      setCoordinates(null);
      setManualLatitude("");
setManualLongitude("");
      fileInputRef.current.value = "";

      onUploadSuccess?.(res.data.data);

      // Redirect back to place detail page if came from there
      if (returnPath) {
        navigate(returnPath);
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ✅ FIXED: Use googlePhotosAPI instead of raw axios
  const handleValidateGoogleLink = async () => {
    if (!googleLink) return toast.error("Enter Google Photos share link");

    try {
      const res = await googlePhotosAPI.validateLink(googleLink);
      toast.success(`Album detected: ${res.data?.title || "Shared Album"}`);
    } catch (err) {
      toast.error(err.message || err || "Invalid link");
    }
  };

  const startGoogleSync = async (payload) => {
    const res = await googlePhotosAPI.syncPhotos(payload);

    setGoogleJob({
      jobId: res.jobId,
      status: res.status || "pending",
      progress: 0,
      processedImages: 0,
      totalImages: 0,
      results: null,
    });
    setGoogleSyncState("starting");
    setGooglePollingErrors(0);
    setGoogleJobError(null);

    if (res.duplicate) {
      toast("A Google Photos import is already running. Resuming progress.");
    } else {
      toast.success("Google Photos import started");
    }
  };

  const buildGoogleSyncPayload = () => ({
    shareLink: googleLink,
    latitude: coordinates?.latitude,
    longitude: coordinates?.longitude,
    placeId: selectedPlaceId || undefined,
    experienceDate: experienceDate || undefined,
    experiencePerson: experiencePerson || undefined,
    uploadedByPerson: uploadedByPerson || undefined,
    experienceDescription: experienceDescription || undefined,
    zipCode: zipCode || undefined,
  });

  const handleGoogleSync = async (payloadOverride) => {
    const isClickEvent =
      payloadOverride &&
      typeof payloadOverride === "object" &&
      "preventDefault" in payloadOverride;
    const payload =
      !payloadOverride || isClickEvent
        ? buildGoogleSyncPayload()
        : payloadOverride;

    if (!payload.shareLink) {
      return toast.error("Enter Google Photos share link");
    }
    if (!coordinates)
      return toast.error("Select or add a place with coordinates");

    try {
      setLastGoogleSyncPayload(payload);
      await startGoogleSync(payload);
    } catch (err) {
      setGoogleSyncState("failed");
      setGoogleJobError(err.message || err || "Sync failed");
      toast.error(err.message || err || "Sync failed");
    }
  };

  const handleRetryGoogleSync = async () => {
    if (lastGoogleSyncPayload) {
      await handleGoogleSync(lastGoogleSyncPayload);
      return;
    }

    await handleGoogleSync();
  };

  const isGoogleProcessing =
    googleSyncState === "starting" || googleSyncState === "processing";
  const googleProgress = googleJob?.progress || 0;
  const googleProcessedImages = googleJob?.processedImages || 0;
  const googleTotalImages = googleJob?.totalImages || 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-2">
      <h2 className="text-2xl font-bold mb-4">Upload Photos / Videos</h2>
      {selectedPlaceDetails && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {selectedPlaceDetails.name}
              </h3>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  {selectedPlaceDetails.city &&
                    `${selectedPlaceDetails.city}, `}
                  {selectedPlaceDetails.state &&
                    `${selectedPlaceDetails.state}, `}
                  {selectedPlaceDetails.country}
                </span>
              </div>
            </div>
            <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
              Uploading to this place
            </span>
          </div>
        </div>
      )}
      {/* PLACE SELECT */}
      {!preselectedPlace && (
        <div className="mb-4">
          <label className="font-medium mb-1 block">
            Select Existing Place
          </label>
          <select
            value={selectedPlaceId}
            onChange={(e) => handlePlaceSelect(e.target.value)}
            className="w-full border rounded p-2 border-gray-400"
          >
            <option value="">-- Select place --</option>
            {places.map((place) => (
              <option key={place._id} value={place._id}>
                {place.name}, {place.city}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* NEW PLACE */}
      {!preselectedPlace && (
        <div className="mb-4">
          <label className="font-medium mb-1 block">Or Add New Place</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPlaceName}
              onChange={(e) => {
                setNewPlaceName(e.target.value);
                setSelectedPlaceId("");
              }}
              placeholder="Enter place name"
              className="flex-1 border rounded p-2 border-gray-400"
            />
            <button
              onClick={geocodePlace}
              className="bg-blue-600 text-white px-4 rounded"
            >
              <MapPin size={18} />
            </button>
          </div>
        </div>
      )}
      <div className="mb-4">
        <label className="font-medium mb-1 block">
          Manual Location Coordinates (Optional)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Latitude</label>
            <input
              type="number"
              step="any"
              value={manualLatitude}
              onChange={(e) => {
                setManualLatitude(e.target.value);
                // Update coordinates state if both lat/lng are provided
                if (e.target.value && manualLongitude) {
                  setCoordinates({
                    latitude: parseFloat(e.target.value),
                    longitude: parseFloat(manualLongitude),
                  });
                }
              }}
              placeholder="e.g., 22.7196"
              className="w-full border rounded p-2 border-gray-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={manualLongitude}
              onChange={(e) => {
                setManualLongitude(e.target.value);
                // Update coordinates state if both lat/lng are provided
                if (manualLatitude && e.target.value) {
                  setCoordinates({
                    latitude: parseFloat(manualLatitude),
                    longitude: parseFloat(e.target.value),
                  });
                }
              }}
              placeholder="e.g., 75.8577"
              className="w-full border rounded p-2 border-gray-400"
            />
          </div>
        </div>
        {coordinates && (
          <p className="text-sm text-gray-600 mb-4">
            📍 Lat: {coordinates.latitude.toFixed(5)}, Lng:{" "}
            {coordinates.longitude.toFixed(5)}
          </p>
        )}
      </div>
      {/* ZIP CODE */}
      <div className="mb-4">
        <label className="font-medium mb-1 block">
          Experience Place Pin / Zip Code
        </label>
        <input
          type="text"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder="Enter zip code"
          className="w-full border rounded p-2 border-gray-400"
        />
      </div>

      {/* EXPERIENCE DESCRIPTION */}
      <div className="mb-4">
        <label className="font-medium mb-1 block">
          Your Experience and About This Place
        </label>
        <textarea
          value={experienceDescription}
          onChange={(e) => setExperienceDescription(e.target.value)}
          placeholder="Write about your experience..."
          rows={5}
          className="w-full border rounded p-2 border-gray-400"
        />
      </div>

      {/* EXPERIENCE DATE */}
      <div className="mb-4">
        <label className="font-medium mb-1 block">Experience Date</label>
        <input
          type="date"
          value={experienceDate}
          onChange={(e) => setExperienceDate(e.target.value)}
          className="w-full border rounded p-2 border-gray-400"
        />
      </div>

      {/* EXPERIENCE PERSON NAME */}
      <div className="mb-4">
        <label className="font-medium mb-1 block">Experience Person Name</label>
        <input
          type="text"
          value={experiencePerson}
          onChange={(e) => setExperiencePerson(e.target.value)}
          placeholder="Name of person who had this experience"
          className="w-full border rounded p-2 border-gray-400"
        />
      </div>

      {/* UPLOADED BY PERSON NAME */}
      <div className="mb-4">
        <label className="font-medium mb-1 block">
          Photos Uploaded By Person Name
        </label>
        <input
          type="text"
          value={uploadedByPerson}
          onChange={(e) => setUploadedByPerson(e.target.value)}
          placeholder="Name of person uploading photos"
          className="w-full border rounded p-2 border-gray-400"
        />
      </div>

      {/* COORDINATES */}
      {coordinates && (
        <p className="text-sm text-gray-600 mb-4">
          📍 Lat: {coordinates.latitude.toFixed(5)}, Lng:{" "}
          {coordinates.longitude.toFixed(5)}
        </p>
      )}

      {/* FILE INPUT */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
        id="upload-input"
      />

      <label
        htmlFor="upload-input"
        className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer"
      >
        <Upload className="w-10 h-10 text-gray-400 mb-2" />
        <p>Select images or videos</p>
      </label>

      {/* PREVIEW */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {previews.map((p, i) => (
          <div key={i} className="relative">
            {p.type.startsWith("image") ? (
              <img src={p.url} className="h-32 w-full object-cover rounded" />
            ) : (
              <video src={p.url} controls className="h-32 w-full rounded" />
            )}
            <button
              onClick={() => {
                setFiles((f) => f.filter((_, idx) => idx !== i));
                setPreviews((pv) => pv.filter((_, idx) => idx !== i));
              }}
              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* GOOGLE PHOTOS IMPORT */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-2">
          Import from Google Photos
        </h3>

        <input
          type="text"
          value={googleLink}
          onChange={(e) => setGoogleLink(e.target.value)}
          placeholder="Paste Google Photos shared album link"
          className="w-full border rounded p-2 border-gray-400 mb-3"
        />

        <div className="flex gap-3">
          <button
            onClick={handleValidateGoogleLink}
            disabled={!googleLink || isGoogleProcessing}
            className="border px-4 py-2 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Validate Link
          </button>

          <button
            onClick={handleGoogleSync}
            disabled={isGoogleProcessing || !googleLink}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGoogleProcessing ? "Importing..." : "Import Photos"}
          </button>
        </div>

        {googleSyncState === "starting" && (
          <div className="mt-4 p-4 border rounded-lg bg-blue-50 border-blue-200 text-blue-800">
            <div className="flex items-center gap-2 text-sm font-medium">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              <span>Preparing Google Photos import job...</span>
            </div>
          </div>
        )}

        {googleJob && googleSyncState === "processing" && (
          <div className="mt-4 p-4 border rounded-lg bg-slate-50 border-slate-200">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">
                  Google Photos import in progress
                </h4>
                <p className="text-sm text-gray-600">
                  Uploading {googleProcessedImages} of {googleTotalImages || "?"} images
                </p>
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {googleProgress}%
              </span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 transition-all duration-500"
                style={{ width: `${googleProgress}%` }}
              />
            </div>

            <div className="mt-3 text-xs text-gray-600 flex flex-wrap gap-3">
              <span>Uploaded: {googleJob.results?.uploaded || 0}</span>
              <span>Skipped: {googleJob.results?.skipped || 0}</span>
              <span>Failed: {googleJob.results?.failed || 0}</span>
            </div>

            {googlePollingErrors > 0 && (
              <p className="mt-3 text-xs text-amber-700">
                Progress check retried automatically {googlePollingErrors} time
                {googlePollingErrors > 1 ? "s" : ""}.
              </p>
            )}
          </div>
        )}

        {googleSyncState === "completed" && googleJob?.results && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <CheckCircle2 className="h-5 w-5" />
              <h4 className="font-semibold">Import completed</h4>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p>Total: {googleJob.results.total}</p>
              <p>Uploaded: {googleJob.results.uploaded}</p>
              <p>Skipped: {googleJob.results.skipped}</p>
              <p>Failed: {googleJob.results.failed}</p>
            </div>
          </div>
        )}

        {googleSyncState === "failed" && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertCircle className="h-5 w-5" />
              <h4 className="font-semibold">Import failed</h4>
            </div>
            <p className="text-sm text-red-700">
              {googleJobError || "Google Photos import failed."}
            </p>
            <button
              onClick={handleRetryGoogleSync}
              className="mt-3 inline-flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Import
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? "Uploading..." : "Upload Files"}
      </button>
    </div>
  );
};

export default PhotoUpload;
