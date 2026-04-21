import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle,
  LoaderCircle,
  RefreshCw,
  Upload,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { googlePhotosAPI } from "../../api/googlePhotos.api";

const GooglePhotosSync = () => {
  const [shareLink, setShareLink] = useState("");
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [albumTitle, setAlbumTitle] = useState("");
  const [job, setJob] = useState(null);
  const [syncState, setSyncState] = useState("idle");
  const [pollErrors, setPollErrors] = useState(0);
  const [jobError, setJobError] = useState(null);
  const pollTimeoutRef = useRef(null);

  useEffect(() => {
    if (!job?.jobId || !["starting", "processing"].includes(syncState)) {
      return undefined;
    }

    let cancelled = false;

    const pollJob = async () => {
      try {
        const progress = await googlePhotosAPI.getSyncProgress(job.jobId);

        if (cancelled) {
          return;
        }

        setJob(progress);
        setPollErrors(0);
        setJobError(null);

        if (progress.status === "completed") {
          setSyncState("completed");
          toast.success(
            `Google Photos sync completed. Uploaded ${progress.results?.uploaded || 0} photos.`
          );
          return;
        }

        if (progress.status === "failed") {
          setSyncState("failed");
          setJobError(progress.error || "Sync failed");
          return;
        }

        setSyncState("processing");
        pollTimeoutRef.current = setTimeout(pollJob, 2000);
      } catch (error) {
        if (cancelled) {
          return;
        }

        let nextCount = 1;
        setPollErrors((prev) => {
          nextCount = prev + 1;
          return nextCount;
        });
        pollTimeoutRef.current = setTimeout(
          pollJob,
          Math.min(10000, 2000 * nextCount)
        );
        setJobError("Connection issue while checking progress. Retrying...");
      }
    };

    pollJob();

    return () => {
      cancelled = true;
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, [job?.jobId, syncState]);

  const handleValidate = async () => {
    if (!shareLink.trim()) {
      toast.error("Please enter album link");
      return;
    }

    try {
      setValidating(true);
      const response = await googlePhotosAPI.validateLink(shareLink);
      setValidated(true);
      setAlbumTitle(response.data?.title || "Shared Album");
      toast.success("Album link is valid");
    } catch (error) {
      setValidated(false);
      toast.error(error.message || error || "Invalid album link");
    } finally {
      setValidating(false);
    }
  };

  const handleSync = async () => {
    if (!validated) {
      toast.error("Please validate the link first");
      return;
    }

    try {
      const response = await googlePhotosAPI.syncPhotos({ shareLink });
      setJob({
        jobId: response.jobId,
        status: response.status || "pending",
        progress: 0,
        processedImages: 0,
        totalImages: 0,
        results: null,
      });
      setSyncState("starting");
      setPollErrors(0);
      setJobError(null);

      if (response.duplicate) {
        toast("Resuming existing sync job");
      } else {
        toast.success("Google Photos sync started");
      }
    } catch (error) {
      setSyncState("failed");
      setJobError(error.message || error || "Failed to start sync");
      toast.error(error.message || error || "Failed to start sync");
    }
  };

  const isSyncing = syncState === "starting" || syncState === "processing";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Sync from Google Photos</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">How to sync:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Open Google Photos and create or select an album</li>
          <li>Click Share and create a public link</li>
          <li>Paste the shared link below</li>
          <li>Start the import and keep this page open to watch progress</li>
        </ol>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Album Share Link</label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={shareLink}
            onChange={(e) => {
              setShareLink(e.target.value);
              setValidated(false);
            }}
            placeholder="https://photos.app.goo.gl/XXXXX"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={isSyncing}
          />
          <button
            onClick={handleValidate}
            disabled={validating || !shareLink.trim() || isSyncing}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {validating ? (
              <LoaderCircle className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            <span>Validate</span>
          </button>
        </div>

        {validated && albumTitle && (
          <div className="mt-2 flex items-center text-green-600 text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Valid album: {albumTitle}</span>
          </div>
        )}
      </div>

      <button
        onClick={handleSync}
        disabled={!validated || isSyncing}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isSyncing ? (
          <>
            <LoaderCircle className="w-5 h-5 animate-spin" />
            <span>Importing photos...</span>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            <span>Import Photos</span>
          </>
        )}
      </button>

      {syncState === "starting" && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          Starting the background job and preparing the album...
        </div>
      )}

      {job && syncState === "processing" && (
        <div className="mt-6 bg-white border rounded-lg p-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Sync Progress</h3>
            <span className="text-sm font-medium">{job.progress || 0}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 transition-all duration-500"
              style={{ width: `${job.progress || 0}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-gray-700">
            Uploading {job.processedImages || 0} of {job.totalImages || "?"} images
          </p>
          <div className="mt-3 text-xs text-gray-600 flex gap-4">
            <span>Uploaded: {job.results?.uploaded || 0}</span>
            <span>Skipped: {job.results?.skipped || 0}</span>
            <span>Failed: {job.results?.failed || 0}</span>
          </div>
          {pollErrors > 0 && (
            <p className="mt-3 text-xs text-amber-700">
              Progress polling retried automatically {pollErrors} time
              {pollErrors > 1 ? "s" : ""}.
            </p>
          )}
        </div>
      )}

      {syncState === "completed" && job?.results && (
        <div className="mt-6 bg-white border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Sync Results</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Photos:</span>
              <span className="font-medium">{job.results.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Successfully Uploaded:</span>
              <span className="font-medium text-green-600">
                {job.results.uploaded}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Skipped:</span>
              <span className="font-medium text-yellow-600">
                {job.results.skipped}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Failed:</span>
              <span className="font-medium text-red-600">
                {job.results.failed}
              </span>
            </div>
          </div>
        </div>
      )}

      {syncState === "failed" && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-semibold">Sync Failed</h3>
          </div>
          <p className="text-sm text-red-700">
            {jobError || "Google Photos sync failed."}
          </p>
          <button
            onClick={handleSync}
            className="mt-4 inline-flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default GooglePhotosSync;
