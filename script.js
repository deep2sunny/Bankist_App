'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////////////////////////////////////////////////
//Functionality: Smooth Scrolling
btnScrollTo.addEventListener('click', function(e) {
  section1.scrollIntoView({behavior: 'smooth'});
});


/////////////////////////////////////////////////////////////////////
//Functionality: Page Navigation
//Insufficient: Performance-wise, attach event handler to multiple elements
// document.querySelectorAll('.nav__link').forEach(function(el) {
//   el.addEventListener('click', function(e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({behavior:'smooth'});
//   });
// });

//Event Delegation
//1. Add Event listener to common parent element
//2. Determine what element originated the event.
document.querySelector('.nav__links').addEventListener('click', function(e) {
  //console.log(e.target);
  e.preventDefault();
  //Matching Strategy
  if(e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior:'smooth'});
  }
});


//Building Tabbed Component
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document. querySelectorAll('.operations__content');

//bad practice
//tabs.forEach(t=>t.addEventListener('click', () => console.log('TAB')));

tabContainer.addEventListener('click', function(e) {
  const clicked = e.target.closest('.operations__tab'); //returns element itself
  //console.log(clicked);

  //Guard Clause
  // if nothing clicked, immediately finish the function: null
  if(!clicked) return;

  //Remove active classes
  tabs.forEach( t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach (c => c.classList.remove('operations__content--active'));

  //Active Tab
  clicked.classList.add('operations__tab--active');

  //Active content area
  //console.log(clicked.dataset.tab );
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

//////////////////////////////////////////////////////////////////
//Menu fade animation
const nav = document.querySelector('.nav');

const handleHover = function(e) {
  if(e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// nav.addEventListener('mouseover', function(e) {
//   handleHover(e,0.5);
// });
//
// nav.addEventListener('mouseout', function(e) {
//   handleHover(e,1);
// });

// Passing argument into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));


/////////////////////////////////////////////////////////////
// Sticky Navigation
// const initialCoords = section1.getBoundingClientRect();
// //console.log(initialCoords);
// window.addEventListener('scroll', function() {
//   //console.log(window.scrollY);
//   if(window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky')
//   } else {
//     nav.classList.remove('sticky')
//   }
// });

// Sticky Navigation using Intersection of Server API
const header = document.querySelector('.header');

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries) {
  const [entry] = entries;
  //console.log(entry);
  if(!entry.isIntersecting){
    nav.classList.add('sticky')
  } else {
    nav.classList.remove('sticky')
  }

}

const headerObserevr = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});
headerObserevr.observe(header);

/////////////////////////////////////////////////////////////////////////
//Reveal sections elements on scroll
const allSections = document.querySelectorAll('.section');

const revealSection = function(entries, observer) {
  const [entry] = entries;
  //console.log(entry);

  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  //unobserve
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function(section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});


/////////////////////////////////////////////////////////////////////////
//Lazy Loading Images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadingImg = function(entries, observer) {
  const [entry] = entries;

  if(!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  //event fires when load is complete
  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadingImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));
