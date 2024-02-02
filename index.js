const parse_line = s => {
  const split_by_quotes = s.split('"');
  for (let i = 0; i < split_by_quotes.length; i++) {
    const part = split_by_quotes[i];
    if (part[0] != "," && part[part.length-1] != ",") {
      split_by_quotes[i] = split_by_quotes[i].replaceAll(",","|||COMMA|||");
    }
  }
  return split_by_quotes.join("").split(",").map(s => s.replaceAll("|||COMMA|||",","));
}

// const judges = []
// let judges_loaded = false;
const add_param = (obj,key,val,list=false) => {
  obj[key] = list ? [val] : val;
}
const append_param = (obj,key,val) => {
  if (!val) return;
  obj[key].push(val);
}
const populate_table = () => {
fetch('data.csv')
  .then(response => response.text())
  .then(data => {
    const lst = data.split("\n").slice(4);
    let curr_judge = {};
    for (let s of lst) {
      const [name,circ,subcirc,type,party,vacancy,site,edu,exp_title,exp_desc,ratings,contr_date,contr_tot,donor_name,donor_amt,donor_date,endorsed] = parse_line(s.trim());
      if (!!name) {
        // judges.push(curr_judge);
        if (!!curr_judge.name) add_judge(curr_judge);
        curr_judge = {};
        add_param(curr_judge, "name", name);
        add_param(curr_judge, "circuit", circ);
        add_param(curr_judge, "subcircuit", subcirc);
        add_param(curr_judge, "type", type);
        add_param(curr_judge, "party", party);
        add_param(curr_judge, "vacancy", vacancy);
        add_param(curr_judge, "website", site, true);
        add_param(curr_judge, "education", edu, true);
        add_param(curr_judge, "experience", {title: exp_title, desc: exp_desc}, true);
        add_param(curr_judge, "ratings", ratings, true);
        add_param(curr_judge, "contribution", {date: contr_date, amount: contr_tot});
        add_param(curr_judge, "donors", {name: donor_name, date: donor_date, amount: donor_amt}, true);
        add_param(curr_judge, "endorsed_by", endorsed, true);
      } else {
        append_param(curr_judge, "website", site);
        append_param(curr_judge, "education", edu);
        if (!!exp_title)
          append_param(curr_judge, "experience", {title: exp_title, desc: exp_desc});
        append_param(curr_judge, "ratings", ratings);
        if (!!donor_name)
          append_param(curr_judge, "donors", {name: donor_name, date: donor_date, amount: donor_amt});
        append_param(curr_judge, "endorsed_by", endorsed);
      }
    }
    add_judge(curr_judge);
    // judges.push(curr_judge);
    // judges.shift();
    // judges_loaded = true;
  });
}

// <th>Candidate</th>
// <th>Circuit</th>
// <th>Subcircuit</th>
// <th>Type of Judgeship</th>
// <th>Party</th>
// <th>Vacancy</th>
// <th>Website</th>
const add_cell = (row,content) => {
  if (content.includes("(") && content.includes(")")) {
    const [main,sub] = content.split("(").map(s => s.trim());
    row.insertCell().innerHTML = `<a href="">${main}</a>\n<small class="d-block">(${sub}</small>`;
    return;
  }
  row.insertCell().innerHTML = `<a href="">${content}</a>`;
}
const add_judge = judge => {
  const table = document.getElementById("judge_table");
  const row = table.insertRow();
  row.classList.add(judge.party.toLowerCase());
  add_cell(row,judge.name);
  add_cell(row,judge.circuit);
  add_cell(row,judge.subcircuit);
  add_cell(row,judge.type);
  add_cell(row,judge.party);
  add_cell(row,judge.vacancy);
  if (!!judge.website[0])
    row.insertCell().innerHTML = `<a href="${judge.website[0]}" class="more">Website</a>`;
  else row.insertCell().innerText = "";
  // row.insertCell().innerHTML = '<a href="#" class="more">More Info</a>';
}

// const populate_table = () => {
//   if (!judges_loaded) {
//     setTimeout(populate_table, 100);
//     return;
//   }
//   for (const judge of judges) {
//     add_judge(judge);
//   }
// }

document.addEventListener("DOMContentLoaded", populate_table);
