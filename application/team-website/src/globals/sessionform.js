export const createSessionFormData = ({cookies}) => {
  const formData = new FormData();
  formData.append('session', cookies.get('session'));
  formData.append('session_sig', cookies.get('session_sig'));
  return formData;
};
