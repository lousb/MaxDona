// formSource.js

export const projectInputs = [
  {
    id: 'displayName',
    label: 'Project Name',
    type: 'text',
    placeholder: 'domengo',
  },
  // ... Other common fields

  {
    id: 'projectColour',
    label: 'Project Color',
    type: 'color',
  },
];

export const projectMainSection = [
  ...projectInputs,
  {
    id: 'releaseDate',
    label: 'Release Date',
    type: 'date',
  },
  {
    id: 'videoLink',
    label: 'Video Link',
    type: 'text',
  },
  {
  id: 'videoName',
  label: 'Video Name',
  type: 'text',
  },
  {
    id: 'mainDescription1',
    label: 'Main Description 1',
    type: 'text',
    maxLength: 65,
  },
  {
    id: 'mainDescription2',
    label: 'Main Description 2',
    type: 'text',
    maxLength: 65,
  },
];

export const projectDetailSection = [
  {
    id: 'detailsTitle',
    label: 'Details Title',
    type: 'text',
  },
  {
    id: 'detailsFirstDescription',
    label: 'Details First Description',
    type: 'text',
    maxLength: 65,
  },
  {
    id: 'detailsSecondDescription',
    label: 'Details Second Section',
    type: 'text',
    maxLength: 65,
  },
];

export const imageSection = [
  {
    id: 'imageUpload',
    label: 'Image Upload',
    type: 'file', // Change this to 'file' for image upload
  },
];
