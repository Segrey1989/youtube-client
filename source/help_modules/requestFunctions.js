const helpFunc = require('./functions');

/* returns the url to search the user query */
const getSearchAdress = (input) => {
  let adressForSearch = 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyDFA-ZatncEM9h_KWtmmskflxMhPfVTnrg&maxResults=15&type=video&videoCaption=closedCaption&part=snippet&q=';
  adressForSearch += input.value
    .replace(/[.\\,/#!$%^&*;:{}=\-_`~()]/g, '')
    .split(' ')
    .filter(x => x)
    .join('+');
  return adressForSearch;
};

/* define url for the request of statistic */
const getStatisticsUrl = (jsonData) => {
  const data = jsonData.items;
  let adressForSearch = 'https://www.googleapis.com/youtube/v3/videos?key=AIzaSyDFA-ZatncEM9h_KWtmmskflxMhPfVTnrg&part=statistics&id=';
  const videoIds = [];
  data.map(x => videoIds.push(x.id.videoId));
  adressForSearch += videoIds.join(',');
  return adressForSearch;
};

const addStatisticInfo = (arr, adress) => {
  const result = arr;
  return fetch(adress)
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }
      throw new TypeError('The response is not JSON');
    })
    .then((response) => {
      const data = response.items;
      for (let i = 0; i < data.length; i += 1) {
        result[i + 1].watched = data[i].statistics.viewCount;
      }
      return result;
    });
};

/* create empty elements for addPageContent */
const handler = (tag, className, container, htmlInfo) => {
  const elem = document.createElement(tag);
  elem.classList.add(className);
  elem.innerHTML = htmlInfo;
  container.appendChild(elem);
};

/* returns array of all info about video */
const getInfo = (jsonData) => {
  const data = jsonData;
  const nextToken = data.nextPageToken;
  const requestInfo = [];
  Array.from(data.items).map(x => requestInfo.push({
    id: x.id.videoId,
    title: x.snippet.title,
    description: x.snippet.description,
    picture: x.snippet.thumbnails.medium.url,
    publishDate: x.snippet.publishedAt.split('')
      .splice(0, 10)
      .join(''),
    author: x.snippet.channelTitle,
  }));
  requestInfo.unshift(nextToken);
  return requestInfo;
};

/* create clear elements when */
const makeCleanEls = (tag, number, className) => {
  const array = [];
  for (let i = 0; i < number; i += 1) {
    const div = document.createElement(tag);
    div.classList.add(className);
    array.push(div);
  }
  return array;
};

/* add content in every element */
const addContent = (infoArr) => {
  const parent = document.querySelector('.images');
  const divs = makeCleanEls('div', infoArr.length - 1, 'slide');
  let count = 1;
  divs.map((x) => {
    const img = document.createElement('img');
    img.src = infoArr[count].picture;
    x.appendChild(img);
    handler('div', 'videoName', x, `<a href = 'https://www.youtube.com/watch?v=${infoArr[count].id}' target='_blank' >${infoArr[count].title}</a>`);
    handler('div', 'author', x, `<i class="fas fa-male"></i><p>${infoArr[count].author}</p>`);
    handler('div', 'date', x, `<i class="fa fa-calendar" aria-hidden="true"></i><p>${infoArr[count].publishDate}</p>`);
    handler('div', 'views', x, `<i class="far fa-eye"></i><p>${infoArr[count].watched}</p>`);
    handler('div', 'description', x, `<p>${infoArr[count].description}</p>`);
    count += 1;
    return x;
  });
  const fragment = document.createDocumentFragment();
  divs.map(x => fragment.appendChild(x));
  parent.appendChild(fragment);
};

/* download more content on the page */
const appendMoreContent = (adr, token) => {
  if (!appendMoreContent.nextToken) {
    appendMoreContent.nextToken = token;
  }
  const append = () => {
    if (!appendMoreContent.nextToken) return;
    const url = `${adr}&pageToken=${appendMoreContent.nextToken}`;
    fetch(url)
      .then((response) => {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        }
        throw new TypeError('The response is not JSON');
      })
      .then((data) => {
        const info = getInfo(data);
        const adress = getStatisticsUrl(data);
        const allInfo = addStatisticInfo(info, adress);
        return allInfo;
      })
      .then((data) => {
        addContent(data);
        helpFunc.changeElemWidth(document.documentElement.clientWidth);
        [appendMoreContent.nextToken] = data;
      })
      .catch(() => {
        if (document.querySelector('.error')) {
          document.querySelector('.error').textContent = 'Problem to download more content. Try once again...';
          document.querySelector('.input').value = '';
        } else {
          const errorBox = document.createElement('div');
          errorBox.classList.add('error');
          errorBox.textContent = 'Problem to download more content. Try once again...';
          document.body.appendChild(errorBox);
        }
      });
  };
  return append();
};


const clearContent = (containerTag) => {
  const elem = document.querySelector(containerTag);
  elem.innerHTML = '';
  elem.style.marginLeft = 0;
};


module.exports = {
  getSearchAdress,
  getInfo,
  addContent,
  appendMoreContent,
  clearContent,
  getStatisticsUrl,
  addStatisticInfo,
};
