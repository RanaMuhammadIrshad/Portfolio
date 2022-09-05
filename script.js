'use strict';
// Nav fade animation
const nav = document.querySelector('.nav');
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky nav
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//Smooth button scrolling
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// GitGub Data fetching
const API_URL = 'https://api.github.com/users/';
const github = document.querySelector('.github');
async function getUser(userName = 'RanaMuhammadIrshad') {
  try {
    const { data } = await axios(API_URL + userName);
    createUserCart(data);
    getRepos(userName);
  } catch (err) {
    createErrorCard('Problem fetching repos');
  }
}
async function getRepos(userName = 'RanaMuhammadIrshad') {
  try {
    const { data } = await axios(API_URL + userName + '/repos?sort=created');
    addReposToCart(data);
  } catch (err) {
    if (err.response.status === 404) {
      createErrorCard('No profile with this username');
    }
  }
}
function createUserCart(user = 'RanaMuhammadIrshad') {
  const html = `
  <div class="card">
  <div class="user-info">
    <ul>
      <li>${user.followers} <strong>Followers</strong></li>
      <li>${user.following} <strong>Following</strong></li>
      <li>${user.public_repos} <strong>Repos</strong></li>
    </ul>
    <div id="repos"></div>
  </div>
</div>

  `;
  github.innerHTML = html;
}
function createErrorCard(msg) {
  const html = `
  <div class = "card">
  <h1>${msg}</h1>
  </div>
  `;
  github.innerHTML = html;
}
function addReposToCart(repos) {
  const reposEl = document.getElementById('repos');
  repos.slice(0, 10).forEach((repo) => {
    const repoLink = document.createElement('a');
    repoLink.classList.add('repo');
    repoLink.href = repo.html_url;
    repoLink.target = '_blank';
    repoLink.innerText = repo.name;
    reposEl.appendChild(repoLink);
  });
}
getUser();

// Tabbed component
const tabs = document.querySelectorAll('.projects__tab');
const tabsContainer = document.querySelector('.projects__tab-container');
const tabsContent = document.querySelectorAll('.projects__content');
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.projects__tab');
  if (!clicked) return;
  tabs.forEach((t) => t.classList.remove('projects__tab--active'));
  tabsContent.forEach((content) =>
    content.classList.remove('projects__content--active')
  );
  clicked.classList.add('projects__tab--active');
  document
    .querySelector(`.projects__content--${clicked.dataset.tab}`)
    .classList.add('projects__content--active');
});

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  const dotContainer = document.querySelector('.dots');
  let curSlide = 0;
  let maxSlide = slides.length;
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  const activateDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach((dot) => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDots(curSlide);
  };
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDots(curSlide);
  };
  const init = function () {
    goToSlide(0);
    createDots();
    activateDots(0);
  };
  init();
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Slider with keyboard arrows
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDots(slide);
    }
  });
};
slider();

// Contact Form
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const yourEmail = document.getElementById('email');
const yourMessage = document.getElementById('message');
const errorElement = document.getElementById('error');

function sendMail() {
  let tempParams = {
    first_name: firstName.value,
    last_name: lastName.value,
    email: email.value,
    message: yourMessage.value,
  };
  emailjs
    .send('service_fhbhj4l', 'template_3rpcqcl', tempParams)
    .then(function (res) {
      alert(
        'Your message has been received successfully! I will contact you as soon as possible. Thank you.',
        res.status
      );
    });
}
const form = document.getElementById('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMail();
  firstName.value = '';
  lastName.value = '';
  yourEmail.value = '';
  yourMessage.value = '';
});
