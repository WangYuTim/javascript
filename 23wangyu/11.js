function init(){
  var divTag = document.getElementById('agou')
  divTag.setAttribute('style','height:80px;width:80px;background-color:green;margin:250px auto')
  console.log(divTag.getAttribute('style'))
}
window.onload=init