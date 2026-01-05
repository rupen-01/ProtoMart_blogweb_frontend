// import React, { useState, useRef } from 'react';
// import { Upload, X, Image as ImageIcon } from 'lucide-react';
// import { photosAPI } from '../../api/photos.api';
// import toast from 'react-hot-toast';

// const PhotoUpload = ({ onUploadSuccess }) => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const fileInputRef = useRef(null);

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file type
//       const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'];
//       if (!validTypes.includes(file.type)) {
//         toast.error('Please select a valid image file (JPEG, PNG, HEIC)');
//         return;
//       }

//       // Validate file size (50MB max)
//       if (file.size > 50 * 1024 * 1024) {
//         toast.error('File size must be less than 50MB');
//         return;
//       }

//       setSelectedFile(file);
      
//       // Create preview
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRemoveFile = () => {
//     setSelectedFile(null);
//     setPreview(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       toast.error('Please select a photo first');
//       return;
//     }

//     try {
//       setUploading(true);
//       setUploadProgress(0);

//       const formData = new FormData();
//       formData.append('photo', selectedFile);

//       // Simulate upload progress
//       const progressInterval = setInterval(() => {
//         setUploadProgress(prev => {
//           if (prev >= 90) {
//             clearInterval(progressInterval);
//             return 90;
//           }
//           return prev + 10;
//         });
//       }, 200);

//       const response = await photosAPI.uploadPhoto(formData);
      
//       clearInterval(progressInterval);
//       setUploadProgress(100);

//       toast.success('Photo uploaded successfully! Waiting for approval.');
      
//       // Reset form
//       handleRemoveFile();
      
//       if (onUploadSuccess) {
//         onUploadSuccess(response.data);
//       }

//     } catch (error) {
//       toast.error(error.message || 'Failed to upload photo');
//     } finally {
//       setUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-6">Upload Travel Photo</h2>

//       {/* File Input */}
//       <div className="mb-6">
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/jpeg,image/jpg,image/png,image/heic"
//           onChange={handleFileSelect}
//           className="hidden"
//           id="photo-upload"
//         />
        
//         {!preview ? (
//           <label
//             htmlFor="photo-upload"
//             className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition"
//           >
//             <Upload className="w-12 h-12 text-gray-400 mb-3" />
//             <p className="text-sm text-gray-600 mb-1">Click to upload photo</p>
//             <p className="text-xs text-gray-400">JPEG, PNG, HEIC (Max 50MB)</p>
//           </label>
//         ) : (
//           <div className="relative">
//             <img
//               src={preview}
//               alt="Preview"
//               className="w-full h-auto rounded-lg"
//             />
//             <button
//               onClick={handleRemoveFile}
//               className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* File Info */}
//       {selectedFile && (
//         <div className="mb-4 p-4 bg-gray-50 rounded-lg">
//           <div className="flex items-center space-x-3">
//             <ImageIcon className="w-8 h-8 text-blue-500" />
//             <div className="flex-1">
//               <p className="text-sm font-medium">{selectedFile.name}</p>
//               <p className="text-xs text-gray-500">
//                 {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Upload Progress */}
//       {uploading && (
//         <div className="mb-4">
//           <div className="flex justify-between text-sm mb-2">
//             <span>Uploading...</span>
//             <span>{uploadProgress}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${uploadProgress}%` }}
//             />
//           </div>
//         </div>
//       )}

//       {/* Upload Button */}
//       <button
//         onClick={handleUpload}
//         disabled={!selectedFile || uploading}
//         className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         {uploading ? 'Uploading...' : 'Upload Photo'}
//       </button>

//       {/* Info */}
//       <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//         <p className="text-sm text-blue-800">
//           <strong>📸 Note:</strong> Photos with GPS location data will be automatically
//           tagged to places. You'll earn 1 Rs reward once your photo is approved!
//         </p>
//       </div>
//     </div>
//   );
// };

// export default PhotoUpload;

import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { photosAPI } from '../../api/photos.api';
import toast from 'react-hot-toast';

const PhotoUpload = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    const validFiles = [];
    const previewList = [];

    selectedFiles.forEach((file) => {
      const isValid =
        file.type.startsWith('image/') ||
        file.type.startsWith('video/');

      if (!isValid) {
        toast.error(`Invalid file: ${file.name}`);
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        toast.error(`File too large (50MB max): ${file.name}`);
        return;
      }

      validFiles.push(file);
      previewList.push({
        url: URL.createObjectURL(file),
        type: file.type,
      });
    });

    setFiles(validFiles);
    setPreviews(previewList);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!files.length) {
      toast.error('Please select photos or videos');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();

      files.forEach((file) => {
        formData.append('photo', file); // ⚠️ backend expects "photo"
      });

      const res = await photosAPI.uploadPhoto(formData);

      toast.success(`Uploaded ${res.data.count} files successfully`);
      setFiles([]);
      setPreviews([]);
      fileInputRef.current.value = '';

      onUploadSuccess?.(res.data.data);
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Upload Photos / Videos</h2>

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
        className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
      >
        <Upload className="w-10 h-10 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">Click to select images or videos</p>
        <p className="text-xs text-gray-400">Max 50MB per file</p>
      </label>

      {/* PREVIEW */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {previews.map((item, index) => (
          <div key={index} className="relative">
            {item.type.startsWith('image') ? (
              <img
                src={item.url}
                alt="preview"
                className="h-40 w-full object-cover rounded"
              />
            ) : (
              <video
                src={item.url}
                controls
                className="h-40 w-full object-cover rounded"
              />
            )}

            <button
              onClick={() => removeFile(index)}
              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload Files'}
      </button>
    </div>
  );
};

export default PhotoUpload;
