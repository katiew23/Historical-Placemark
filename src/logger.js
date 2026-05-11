export function validationError(request, h, error) {
  console.log(error.message);
  throw error;
}

// is used to handle and log validation errors
