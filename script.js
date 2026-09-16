// Menú móvil
  const menuBtn = document.getElementById('menuBtn');
  const menuMovil = document.getElementById('menu-movil');
  menuBtn.addEventListener('click', () => menuMovil.classList.toggle('abierto'));
  menuMovil.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menuMovil.classList.remove('abierto')));

  // Organigrama y mapa de procesos interactivos (clic para desplegar/ocultar)
  document.querySelectorAll('[data-toggle]').forEach(el => {
    el.addEventListener('click', () => {
      const destino = document.getElementById(el.dataset.toggle);
      if (!destino) return;
      const estabaOculto = destino.classList.contains('oculto');
      destino.classList.toggle('oculto');
      el.classList.toggle('activo', estabaOculto);
    });
  });

  // Animación al hacer scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Mascota que se desplaza por el costado según el scroll
  const mascota = document.getElementById('mascotaFlotante');
  const fideoSvg = document.getElementById('fideoSvg');
  const fideoPath = document.getElementById('fideoPath');

  function trazoFideo(alto){
    const seguro = Math.max(alto, 1);
    const amplitud = 6.5;
    const paso = 22;
    let d = `M 12 ${seguro}`;
    let y = seguro;
    let dir = 1;
    while (y > 0){
      const siguienteY = Math.max(y - paso, 0);
      const medioY = y - (y - siguienteY) / 2;
      d += ` Q ${12 + dir * amplitud} ${medioY} 12 ${siguienteY}`;
      dir *= -1;
      y = siguienteY;
    }
    return d;
  }

  if (mascota) {
    let objetivo = 120;
    let actual = 120;
    function calcularObjetivo(){
      const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
      const progreso = alturaTotal > 0 ? window.scrollY / alturaTotal : 0;
      const margenSuperior = 110;
      const margenInferior = 90;
      const rango = Math.max(window.innerHeight - margenSuperior - margenInferior, 0);
      objetivo = margenSuperior + progreso * rango;
    }
    function animar(){
      actual += (objetivo - actual) * 0.15;
      mascota.style.top = actual + 'px';
      if (fideoSvg && fideoPath) {
        const alto = Math.max(actual, 1);
        fideoSvg.setAttribute('viewBox', `0 0 24 ${alto}`);
        fideoSvg.setAttribute('height', alto);
        fideoPath.setAttribute('d', trazoFideo(alto));
      }
      requestAnimationFrame(animar);
    }
    window.addEventListener('scroll', calcularObjetivo, { passive: true });
    window.addEventListener('resize', calcularObjetivo);
    calcularObjetivo();
    actual = objetivo;
    requestAnimationFrame(animar);
  }
