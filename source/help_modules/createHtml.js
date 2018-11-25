module.exports = {
  /* create and append searching box into document */
  createQueryInput: () => {
    const input = document.createElement('input');
    input.classList.add('input');
    input.classList.add('inputBegin');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'What are we looking for?');
    document.body.appendChild(input);
  },

  /* create radioButtons, append it into parent element */
  createRadio: (parent, num) => {
    const input = document.createElement('input');
    const label = document.createElement('label');
    input.type = 'radio';
    input.name = 'radioButton';
    for (let i = 1; i <= num; i += 1) {
      const cloneInp = input.cloneNode(true);
      cloneInp.id = `radio${i}`;
      const cloneLab = label.cloneNode(true);
      cloneLab.setAttribute('for', cloneInp.id);
      cloneLab.classList.add(`pseudo${i}`);
      cloneLab.setAttribute('data-title', i);
      parent.appendChild(cloneInp);
      parent.appendChild(cloneLab);
    }
  },
};
