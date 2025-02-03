// formSource.js

export const referenceMainSection = [
  {
  id: 'releaseDate',
  label: 'Release Date',
  type: 'date',

},
{
  id: 'mainDescription1',
  label: 'Main Description 1',
  type: 'text',
  placeholder: '...',
},
{
  id: 'mainDescription2',
  label: 'Main Description 2',
  type: 'text',
  placeholder: '...',
},  
]

export const pdfSectionSource = [
  {
    id: 'pdfName',
  label: 'PDF Name',
  type: 'text',
  placeholder: '...',
}
]

export const videoSectionSource = [
{
  id: 'videoLink',
  label: 'Video Link',
  type: 'text',
  placeholder: 'https://youtube.com',
},
{
  id: 'videoName',
label: 'Video Name',
type: 'text',
placeholder: '...',
}
]


export const projectMainSection = [
  {
    id: 'releaseDate',
    label: 'Release Date',
    type: 'date',
  
  },
  {
    id: 'videoLink',
    label: 'Video Link',
    type: 'text',
    placeholder: 'https://youtube.com',
  },
  {
    id: 'focusGenre',
    label: 'Genre',
    type: 'text',
    placeholder: 'eg: Art Direction',
  },
  {
  id: 'videoName',
  label: 'Video Name',
  type: 'text',
  placeholder: 'Example Name',
  },
  {
    id: 'mainDescription1',
    label: 'Main Description 1',
    type: 'text',
    maxLength: 65,
    placeholder: '...',
  },
  {
    id: 'mainDescription2',
    label: 'Main Description 2',
    type: 'text',
    maxLength: 65,
    placeholder: '...',
  },
  {
    id: 'role',
    label: 'Role',
    type: 'text',
    placeholder: 'e.g Directed, Filmed',
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



export const textSectionSource = [
{
  id: 'textFirstDescription',
  label: 'First Description',
  type: 'text',

},
{
  id: 'textSecondDescription',
  label: 'Second Description',
  type: 'text',
},
];

export const titleSectionSource = [
{
  id: 'titleTitle',
  label: 'Section Title',
  type: 'text',
},
]

export const largeImageSection = [
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
]