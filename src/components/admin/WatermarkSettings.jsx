// import React, { useEffect, useState } from 'react';
// import { adminAPI } from '../../api/admin.api';
// import { Save, RefreshCw } from 'lucide-react';
// import toast from 'react-hot-toast';

// const WatermarkSettings = () => {
//   const [settings, setSettings] = useState({
//     text: '',
//     fontSize: 24,
//     color: '#FFFFFF',
//     position: { x: 50, y: 90 },
//     opacity: 0.7
//   });
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const fetchSettings = async () => {
//     try {
//       setLoading(true);
//       const response = await adminAPI.getWatermarkSettings();
//       setSettings({
//         text: response.data.text,
//         fontSize: response.data.fontSize,
//         color: response.data.color,
//         position: response.data.position,
//         opacity: response.data.opacity
//       });
//     } catch (error) {
//       toast.error('Failed to load watermark settings');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       await adminAPI.updateWatermarkSettings(settings);
//       toast.success('Watermark settings updated successfully');
//     } catch (error) {
//       toast.error('Failed to update watermark settings');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <div className="animate-pulse space-y-4">
//           <div className="h-10 bg-gray-200 rounded" />
//           <div className="h-10 bg-gray-200 rounded" />
//           <div className="h-10 bg-gray-200 rounded" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold">Watermark Settings</h2>
//         <button
//           onClick={fetchSettings}
//           className="text-blue-600 hover:text-blue-700"
//         >
//           <RefreshCw className="w-5 h-5" />
//         </button>
//       </div>

//       <div className="space-y-6">
//         {/* Watermark Text */}
//         <div>
//           <label className="block text-sm font-medium mb-2">Watermark Text</label>
//           <input
//             type="text"
//             value={settings.text}
//             onChange={(e) => setSettings({ ...settings, text: e.target.value })}
//             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//             placeholder="© BodyCureHealth Travel"
//           />
//         </div>

//         {/* Font Size */}
//         <div>
//           <label className="block text-sm font-medium mb-2">
//             Font Size: {settings.fontSize}px
//           </label>
//           <input
//             type="range"
//             min="10"
//             max="100"
//             value={settings.fontSize}
//             onChange={(e) => setSettings({ ...settings, fontSize: parseInt(e.target.value) })}
//             className="w-full"
//           />
//         </div>

//         {/* Color */}
//         <div>
//           <label className="block text-sm font-medium mb-2">Color</label>
//           <div className="flex items-center space-x-4">
//             <input
//               type="color"
//               value={settings.color}
//               onChange={(e) => setSettings({ ...settings, color: e.target.value })}
//               className="h-10 w-20 rounded cursor-pointer"
//             />
//             <input
//               type="text"
//               value={settings.color}
//               onChange={(e) => setSettings({ ...settings, color: e.target.value })}
//               className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="#FFFFFF"
//             />
//           </div>
//         </div>

//         {/* Position */}
//         <div>
//           <label className="block text-sm font-medium mb-2">
//             Position (X: {settings.position.x}%, Y: {settings.position.y}%)
//           </label>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Horizontal (X)</label>
//               <input
//                 type="range"
//                 min="0"
//                 max="100"
//                 value={settings.position.x}
//                 onChange={(e) => setSettings({
//                   ...settings,
//                   position: { ...settings.position, x: parseInt(e.target.value) }
//                 })}
//                 className="w-full"
//               />
//             </div>
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Vertical (Y)</label>
//               <input
//                 type="range"
//                 min="0"
//                 max="100"
//                 value={settings.position.y}
//                 onChange={(e) => setSettings({
//                   ...settings,
//                   position: { ...settings.position, y: parseInt(e.target.value) }
//                 })}
//                 className="w-full"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Opacity */}
//         <div>
//           <label className="block text-sm font-medium mb-2">
//             Opacity: {(settings.opacity * 100).toFixed(0)}%
//           </label>
//           <input
//             type="range"
//             min="0"
//             max="1"
//             step="0.1"
//             value={settings.opacity}
//             onChange={(e) => setSettings({ ...settings, opacity: parseFloat(e.target.value) })}
//             className="w-full"
//           />
//         </div>

//         {/* Preview */}
//         <div>
//           <label className="block text-sm font-medium mb-2">Preview</label>
//           <div className="bg-gray-100 rounded-lg p-8 relative h-64 flex items-center justify-center">
//             <div className="text-gray-400 text-center">
//               <p className="text-sm mb-2">Sample Photo Background</p>
//               <p className="text-xs">Watermark preview would appear here</p>
//             </div>
//             <div
//               className="absolute"
//               style={{
//                 left: `${settings.position.x}%`,
//                 top: `${settings.position.y}%`,
//                 transform: 'translate(-50%, -50%)',
//                 fontSize: `${settings.fontSize}px`,
//                 color: settings.color,
//                 opacity: settings.opacity,
//                 fontWeight: 'bold',
//                 textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
//               }}
//             >
//               {settings.text || 'Sample Text'}
//             </div>
//           </div>
//         </div>

//         {/* Save Button */}
//         <button
//           onClick={handleSave}
//           disabled={saving}
//           className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
//         >
//           <Save className="w-5 h-5" />
//           <span>{saving ? 'Saving...' : 'Save Settings'}</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default WatermarkSettings;
import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../api/admin.api';
import { Save, RefreshCw, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

const WatermarkSettings = () => {
  const [settings, setSettings] = useState({
    type: 'text',
    text: '',
    fontFamily: 'Arial', // ✅ Added fontFamily
    fontSize: 24,
    color: '#FFFFFF',
    position: { x: 50, y: 90 },
    opacity: 0.7
  });

  const [watermarkImage, setWatermarkImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Popular fonts list
  const fontFamilies = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Trebuchet MS', label: 'Trebuchet MS' },
    { value: 'Impact', label: 'Impact' },
    { value: 'Comic Sans MS', label: 'Comic Sans MS' },
    { value: 'Palatino', label: 'Palatino' },
    { value: 'Garamond', label: 'Garamond' },
    { value: 'Bookman', label: 'Bookman' },
    { value: 'Tahoma', label: 'Tahoma' },
    { value: 'Lucida Console', label: 'Lucida Console' }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getWatermarkSettings();

      setSettings({
        type: res.data.type || 'text',
        text: res.data.text || '',
        fontFamily: res.data.fontFamily || 'Arial', // ✅ Get fontFamily
        fontSize: res.data.fontSize || 24,
        color: res.data.color || '#FFFFFF',
        position: res.data.position || { x: 50, y: 90 },
        opacity: res.data.opacity ?? 0.7
      });

      if (res.data.type === 'image' && res.data.watermarkImageUrl) {
        setExistingImageUrl(res.data.watermarkImageUrl);
      }

    } catch (error) {
      toast.error('Failed to load watermark settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (settings.type === 'image' && !watermarkImage && !existingImageUrl) {
        toast.error('Please select a watermark image');
        return;
      }

      setSaving(true);

      const formData = new FormData();
      formData.append('type', settings.type);
      formData.append('position', JSON.stringify(settings.position));
      formData.append('opacity', settings.opacity.toString());

      if (settings.type === 'text') {
        formData.append('text', settings.text || '');
        formData.append('fontFamily', settings.fontFamily); // ✅ Send fontFamily
        formData.append('fontSize', settings.fontSize.toString());
        formData.append('color', settings.color);
      } else if (settings.type === 'image') {
        if (watermarkImage instanceof File) {
          formData.append('watermarkImage', watermarkImage);
        }
      }

      await adminAPI.updateWatermarkSettings(formData);
      toast.success('Watermark settings updated successfully');
      
      setWatermarkImage(null);
      fetchSettings();

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update watermark settings');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setWatermarkImage(file);
    }
  };

  const handleRemoveImage = () => {
    setWatermarkImage(null);
    const fileInput = document.getElementById('watermark-file-input');
    if (fileInput) fileInput.value = '';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Watermark Settings</h2>
        <button onClick={fetchSettings} className="text-blue-600 hover:text-blue-700">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Watermark Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Watermark Type</label>
          <select
            value={settings.type}
            onChange={(e) => {
              setSettings({ ...settings, type: e.target.value });
              if (e.target.value === 'text') {
                setWatermarkImage(null);
              }
            }}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
          </select>
        </div>

        {/* Text Settings */}
        {settings.type === 'text' && (
          <>
            {/* Watermark Text */}
            <div>
              <label className="block text-sm font-medium mb-2">Watermark Text</label>
              <input
                type="text"
                value={settings.text}
                onChange={(e) => setSettings({ ...settings, text: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="© BodyCureHealth Travel"
              />
            </div>

            {/* ✅ Font Family Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">Font Family</label>
              <select
                value={settings.fontFamily}
                onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                style={{ fontFamily: settings.fontFamily }}
              >
                {fontFamilies.map((font) => (
                  <option 
                    key={font.value} 
                    value={font.value}
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Font Size: {settings.fontSize}px
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={settings.fontSize}
                onChange={(e) => setSettings({ ...settings, fontSize: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={settings.color}
                  onChange={(e) => setSettings({ ...settings, color: e.target.value })}
                  className="h-10 w-20 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.color}
                  onChange={(e) => setSettings({ ...settings, color: e.target.value })}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </>
        )}

        {/* Image Upload */}
        {settings.type === 'image' && (
          <div>
            <label className="block text-sm font-medium mb-2">Watermark Image</label>
            
            <div className="flex items-center space-x-4">
              <label
                htmlFor="watermark-file-input"
                className="flex items-center space-x-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-50"
              >
                <Upload className="w-4 h-4" />
                <span>Choose Image</span>
              </label>
              <input
                id="watermark-file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Preview - New Image */}
            {watermarkImage instanceof File && (
              <div className="mt-4 relative inline-block">
                <img
                  src={URL.createObjectURL(watermarkImage)}
                  alt="New watermark preview"
                  className="w-32 h-32 object-contain border rounded-lg"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  New: {watermarkImage.name}
                </p>
              </div>
            )}

            {/* Preview - Existing Image */}
            {!watermarkImage && existingImageUrl && (
              <div className="mt-4">
                <img
                  src={existingImageUrl}
                  alt="Current watermark"
                  className="w-32 h-32 object-contain border rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">Current watermark</p>
              </div>
            )}

            {/* No image */}
            {!watermarkImage && !existingImageUrl && (
              <p className="text-sm text-red-500 mt-2">
                ⚠️ No watermark image selected
              </p>
            )}
          </div>
        )}

        {/* Position */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Position (X: {settings.position.x}%, Y: {settings.position.y}%)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Horizontal (X)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.position.x}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    position: { ...settings.position, x: Number(e.target.value) }
                  })
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Vertical (Y)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.position.y}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    position: { ...settings.position, y: Number(e.target.value) }
                  })
                }
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Opacity */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Opacity: {(settings.opacity * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.opacity}
            onChange={(e) => setSettings({ ...settings, opacity: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium mb-2">Preview</label>
          <div className="relative h-64 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            <div className="text-gray-400 text-center text-sm">
              Sample Photo Background
            </div>
            
            {settings.type === 'text' ? (
              <div
                className="absolute font-bold"
                style={{
                  left: `${settings.position.x}%`,
                  top: `${settings.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                  fontFamily: settings.fontFamily, // ✅ Apply fontFamily
                  fontSize: `${settings.fontSize}px`,
                  color: settings.color,
                  opacity: settings.opacity,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                {settings.text || 'Sample Text'}
              </div>
            ) : (
              (watermarkImage || existingImageUrl) && (
                <img
                  src={
                    watermarkImage instanceof File
                      ? URL.createObjectURL(watermarkImage)
                      : existingImageUrl
                  }
                  alt="watermark preview"
                  className="absolute max-w-24 max-h-24 object-contain"
                  style={{
                    left: `${settings.position.x}%`,
                    top: `${settings.position.y}%`,
                    transform: 'translate(-50%, -50%)',
                    opacity: settings.opacity
                  }}
                />
              )
            )}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving || (settings.type === 'image' && !watermarkImage && !existingImageUrl)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default WatermarkSettings;