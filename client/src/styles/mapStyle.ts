export const mapStyle = [
  {
    featureType: 'all',
    elementType: 'all',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'all',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [
      {
        visibility: 'on',
      },
      {
        color: '#d8e0e7',
      },
    ],
  },

  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        visibility: 'on',
      },
      {
        color: '#d3d3d3',
      },
      {
        lightness: '-7',
      },
      {
        gamma: '0.55',
      },
      {
        weight: '1.62',
      },
    ],
  },
];
