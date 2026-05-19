export const loggedInUser = $state({
  email: "",
  name: "",
  role: "",
  token: "",
  _id: ""
});

export const currentCollections = $state({
  collections: []
});

export const currentPlacemarks = $state({
  placemarks: []
});