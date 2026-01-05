// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { MapPin, Eye, Heart, Calendar } from 'lucide-react';
// import { format } from 'date-fns';

// const PhotoCard = ({ photo }) => {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate(`/photos/${photo._id}`);
//   };

//   // Use watermarked thumbnail if available, else original
//   const imageUrl = photo.thumbnailUrl || photo.watermarkedUrl || photo.originalUrl;

//   return (
//     <div
//       onClick={handleClick}
//       className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
//     >
//       {/* Image */}
//       <div className="relative h-64 overflow-hidden bg-gray-200">
//         <img
//           src={imageUrl}
//           alt={photo.placeName || 'Travel photo'}
//           className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
//           loading="lazy"
//         />
        
//         {/* Approval Status Badge */}
//         {photo.approvalStatus === 'pending' && (
//           <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
//             Pending
//           </div>
//         )}
//         {photo.approvalStatus === 'rejected' && (
//           <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
//             Rejected
//           </div>
//         )}
//       </div>

//       {/* Content */}
//       <div className="p-4">
//         {/* Location */}
//         {photo.placeName && (
//           <div className="flex items-center text-gray-700 mb-2">
//             <MapPin className="w-4 h-4 mr-1 text-blue-500" />
//             <span className="text-sm font-medium truncate">
//               {photo.placeName}
//               {photo.city && `, ${photo.city}`}
//             </span>
//           </div>
//         )}

//         {/* User */}
//         {photo.userId && (
//           <div className="flex items-center mb-3">
//             <img
//               src={photo.userId.profilePhoto || '/default-avatar.png'}
//               alt={photo.userId.name}
//               className="w-8 h-8 rounded-full mr-2"
//             />
//             <span className="text-sm text-gray-600">{photo.userId.name}</span>
//           </div>
//         )}

//         {/* Stats */}
//         <div className="flex items-center justify-between text-gray-500 text-sm">
//           <div className="flex items-center space-x-3">
//             <div className="flex items-center">
//               <Eye className="w-4 h-4 mr-1" />
//               <span>{photo.views || 0}</span>
//             </div>
//             <div className="flex items-center">
//               <Heart className="w-4 h-4 mr-1" />
//               <span>{photo.likes || 0}</span>
//             </div>
//           </div>
          
//           {photo.createdAt && (
//             <div className="flex items-center">
//               <Calendar className="w-4 h-4 mr-1" />
//               <span>{format(new Date(photo.createdAt), 'MMM dd')}</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PhotoCard;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Eye, Heart, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const PhotoCard = ({ photo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/photos/${photo._id}`);
  };

  const mediaUrl =
    photo.thumbnailUrl ||
    photo.watermarkedUrl ||
    photo.originalUrl;

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition"
    >
      <div className="relative h-64 bg-gray-200">
        {photo.mediaType === 'video' ? (
          <video
            src={mediaUrl}
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={mediaUrl}
            alt="Travel"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}

        {photo.approvalStatus === 'pending' && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
            Pending
          </span>
        )}
      </div>

      <div className="p-4">
        {photo.placeName && (
          <div className="flex items-center mb-2 text-sm">
            <MapPin className="w-4 h-4 mr-1 text-blue-500" />
            {photo.placeName}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex space-x-3">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {photo.views || 0}
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {photo.likes || 0}
            </div>
          </div>

          {photo.createdAt && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {format(new Date(photo.createdAt), 'MMM dd')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
