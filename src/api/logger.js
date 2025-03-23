
// Handles validation errors in 
// hapi swagger validation
export function validationError(request, h, error) {
    console.log(error.message);
  }