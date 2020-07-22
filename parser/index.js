const parse = require('csv-parse/lib/sync');
const fs = require('fs');

const stampElement = ([headline, description, price], i) => {
  if (description === '' && price === '') {
    return i === 0 ? `<h2>${headline}</h2><hr/>` : `<p>${headline}</p>`;
  } else {
    return `
      <blockquote>
        <aside>
          ${price}
          <br />
          <label class="container favorite">
            <input type="checkbox">
            <span class="checkmark"></span>
          </label>
        </aside>
        ${headline}
        <cite>${description}</cite>
      </blockquote>
    `;
  }
};

  const id = "kids";
  fs.readFile(`data/${id}.csv`, function(err, data) {
    const records = parse(data, {
    skip_empty_lines: true
  });
  console.log(records.map(stampElement));
  fs.writeFile(
    `output/${id}.html`,
    `<section id="section-${id}">
      ${records.map(stampElement).join('\n')}
    </section>`,
    function(err, data) {
      console.log("All done");
    }
  );
});
