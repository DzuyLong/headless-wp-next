export const GET_TOURS_QUERY = /* GraphQL */ `
  query GetTours {
    tours {
      nodes {
        id
        databaseId
        slug
        title
        tourGroupAcf {
          fieldGroupName
          tourDesc
          tourDuration
          tourName
          tourPriceFrom
          tourFeaturedImage {
            node {
              mediaItemUrl
            }
          }
          tourGallery {
            edges {
              node {
                mediaItemUrl
              }
            }
          }
        }
      }
    }
  }
`;