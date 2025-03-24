export const catchError = (err, setError) => {
  console.error('Hata:', err);
  
  if (err.response?.data?.data) {
    const allErrors = [];
    for (const error of err.response.data.data) {
      for (const message of error.errors) {
        allErrors.push(message);
      }
    }
    setError(allErrors);
  } else if (err.response?.data?.message) {
    setError([err.response.data.message]);
  } else {
    setError(['Bir hata oluştu. Lütfen tekrar deneyin.']);
  }
}; 