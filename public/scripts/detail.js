function handler(id) {
    document.getElementById("notes" + id).setAttribute("hidden", true)
    document.getElementById("edit" + id).setAttribute("hidden", true)
    document.getElementById("done" + id).removeAttribute("hidden")
    document.getElementById("input" + id).removeAttribute("hidden")
  }
        
function confirmDelete() {
    document.getElementById('formDelete').removeAttribute("hidden")
  }
function cancelDelete() {
    document.getElementById('formDelete').setAttribute("hidden", true)
  }