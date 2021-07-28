'use strict';

// const { init } = require('events');

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const navLink = document.querySelectorAll('.nav__link');
const navLinks = document.querySelector('.nav__links');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
// btnsOpenModal returns a nodeList from the DOM
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
///////////////////////////////////////////
// implementing smooth scrolling feature
btnScrollTo.addEventListener('click', function (e) {
  // to coordinate of the section1 element
  // const section1Coordinate = section1.getBoundingClientRect();
  // MODERN WAY to scroll to desired location on the DOM
  section1.scrollIntoView({ behavior: 'smooth' });
  // console.log(section1Coordinate);
  // to get current page scroll position
  // console.log(window.pageXOffset, window.pageYOffset);
  //OLD WAYS to scroll to desired location on the DOM

  // window.scrollTo(
  //   section1Coordinate.left + window.pageXOffset,
  //   section1Coordinate.top + window.pageYOffset
  // );
  // window.scrollTo({
  //   left: section1Coordinate.left + window.pageXOffset,
  //   top: section1Coordinate.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
});
///////////////////////////////////////
// PAGE NAVIGATION

// navLink.forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     // console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Using event delegation
// 1: Add event listener to common parent element
// 2: Determine what element originated the event

navLinks.addEventListener('click', function (e) {
  e.preventDefault();
  // MAtching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
///////////////////////////////////////
// TABBED COMPONENT
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// Using event delegation

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);
  // guard clause
  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // active content area
  clicked.classList.add('operations__tab--active');
  const activeComponent = document.querySelector(
    `.operations__content--${clicked.dataset.tab}`
  );
  activeComponent.classList.add('operations__content--active');
});

// Menu fade animation
const nav = document.querySelector('.nav');

const handlerHover = function (e /*, opacity*/) {
  // console.log(this)
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    // console.log(link);
    // DOM traversing begins
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// nav.addEventListener('mouseover', function (e) {
//   handlerHover(e,0.5)
// });
// // Menu unfading animation
// nav.addEventListener('mouseout', function (e) {
//  handlerHover(e,1)
// });

// Menu unfading animation
/*******PASSING "ARGUMENT" INTO HANDLER******/
nav.addEventListener('mouseover', handlerHover.bind(0.5));
nav.addEventListener('mouseout', handlerHover.bind(1));

// STICKEY NAVIGATION
const initialcoords = section1.getBoundingClientRect();
/*using of scroll event is very very poor for this effect*/
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialcoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
/*using of Intersection observer API is the best practice*/
// const observerCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const observerOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(observerCallback, observerOptions);
// observer.observe(section1);
const header = document.querySelector('.header');
const height = nav.getBoundingClientRect().height;
// console.log(height);
const stickyNavigation = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNavigation, {
  root: null,
  threshold: 0,
  rootMargin: `-${height}px`,
});
headerObserver.observe(header);
// Smooth appearance animation of section
const allSection = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  // Guard clause
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  // console.log(this)
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSection.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // guard clause
  if (!entry.isIntersecting) return;

  // replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '100px',
});

imgTargets.forEach(img => imgObserver.observe(img));
const slidingMovement = function () {
  // slider
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotsContainer = document.querySelector('.dots');

  let currentSlide = 0;
  const maxSlide = slides.length;
  // console.log(maxSlide)

  // slider.style.transform = 'scale(0.4) translateX(-800px)';
  // slider.style.overflow = 'visible';

  // creating slider position indicator
  const createDot = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide = "${i}"></button>`
      );
    });
  };
  // createDot();

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide = "${slide}"]`)
      .classList.add('dots__dot--active');
  };
  // activateDot(0);

  const gotoSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };
  // gotoSlide(0);

  // next slide
  const nextSlide = function () {
    if (currentSlide == maxSlide - 1) currentSlide = 0;
    else currentSlide++;

    gotoSlide(currentSlide);
    activateDot(currentSlide);
  };

  // previous slide
  const prevSlide = function () {
    if (currentSlide == 0) currentSlide = maxSlide - 1;
    else currentSlide--;

    gotoSlide(currentSlide);
    activateDot(currentSlide);
  };
  const initializer = function () {
    gotoSlide(0);
    createDot();

    activateDot(0);
  };
  initializer();
  // event Handler
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function (e) {
    // console.log(e);
    if (e.key === 'ArrowRight') nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // console.log('DOT');
      const { slide } = e.target.dataset;
      gotoSlide(slide);
      activateDot(slide);
    }
  });
};
slidingMovement();
