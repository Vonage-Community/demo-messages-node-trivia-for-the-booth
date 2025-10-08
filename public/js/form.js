document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('.needs-validation');
  console.log(forms);

  // update styles for validation
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      'submit',
      (event) => {
        console.log('Submit');
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add('was-validated');
      },
      false,
    );
  });
});
