const xlsxFile = require('read-excel-file/node');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const slugify = require('slugify');
const fs = require('fs');

JSDOM.fromFile("template.html", {}).then(async dom => {
    const document = dom.window.document;

    async function htmlToElement(html) {
        var div = await document.createElement('div');
        div.innerHTML = html.trim();
        // Change this to div.childNodes to support multiple top-level nodes
        const el = await div.firstChild;
        return el; 
    }

    const sheets = await xlsxFile('./Menu.xlsx', { getSheets: true });
    for (const obj of sheets) {
        // For each section...   
        const sectionName = `section-${slugify(obj.name, '_')}`.replace('!', '');
        const pageContent = document.getElementById('page-content');
        const newSection = await htmlToElement(`
            <section id="${sectionName}"></section>
        `);
        await pageContent.appendChild(newSection);
        if (obj.name.includes('!')) {
            const baseName = (obj.name.replace('!', ''));
            const name = slugify(baseName, '_');
            const newLink = await htmlToElement(`
                <a class="pageBtn button" id="btn-${name}">${baseName}</a>
            `);
            await document.getElementById('quicklinks').appendChild(newLink);
        }
        const rows = await xlsxFile('./Menu.xlsx', { sheet: obj.name });
        for (i in rows) {
            // For each piece of content...
            if (rows[i][0] === "Type") {
                continue;
            } else {
                switch (rows[i][0]) {
                    case "title":
                        await document.getElementById(sectionName).appendChild(await htmlToElement(`
                            <h2>${rows[i][1]}</h2>
                            <hr />
                        `));
                        break;
                    case "text":
                        document.getElementById(sectionName).appendChild(await htmlToElement(`
                            <p>${rows[i][1]}</p>
                            <hr />
                        `));
                        break;
                    case "button":
                        document.getElementById(sectionName)
                            .appendChild(await htmlToElement(`
                                <ul>
                                    <li>
                                        <a class="pageBtn button" id="btn-${slugify(rows[i][1], '_')}">${rows[i][2] || rows[i][1]}</a>
                                    </li>
                                </ul>
                            `));
                        break;
                    case "item":
                        document.getElementById(sectionName)
                            .appendChild(await htmlToElement(`        
                                <blockquote>
                                    <aside>
                                    $${rows[i][3] || '&nbsp;'}
                                    <br />
                                    <label class="container favorite">
                                        <input type="checkbox">
                                        <span class="checkmark"></span>
                                    </label>
                                    </aside>
                                    ${rows[i][1] || '&nbsp;'}
                                    <cite>${rows[i][2] || '&nbsp;'}</cite>
                                </blockquote>
                            `));
                        break;
                }
            }
        }
    };

    await document.getElementById('page-content').appendChild(await htmlToElement(`
        <section id="section-favorites">
            <h2>
                Favorites
            </h2>
            <hr/>
            <p>
                Heart your favorite menu items and look at them all here!
            </p>
            <div>
                <!-- Favorites are cloned in here -->
            </div>
        </section>
    `));

    // console.log(dom.serialize());
    fs.writeFile('output.html', dom.serialize(), function (err) {
        if (err) throw err;
        console.log('Finished!');
    });
});



