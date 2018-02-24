$(function() {
  const list = document.querySelector('#urls');
  $.get('/urls', function(urls) {
    urls.forEach(function(url) {
      list.innerHTML += `<li><code>${url.url} shortened to -> /${url.id}</code></li>`;
    });
  });
  
  const form = document.querySelector('form');
  const urlName = document.querySelector('#urlName');
  
  form.addEventListener('submit', () => {
    $.post(`/urls?urlName=${urlName.value}`);
  });
});
