"use strict";
const students = [
    { _id: "001", name: 'Le Trong Tuan' },
    { _id: "002", name: 'Le Trong Huy' },
    { _id: "003", name: 'Van Thi Thao Nhi' }
];
const student_list = document.getElementById('student_list');
const search_input = document.getElementById('search_input');
function debounce(callback, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}
const handleSearch = debounce((keyword) => {
    const result = students.filter(stds => {
        return stds.name
            .split(" ")
            .some(item => item.toLowerCase().startsWith(keyword.trim().toLowerCase()));
    });
    console.log(result);
    render(result);
}, 500);
function render(data) {
    let html = ``;
    data.map(item => html += `
        <tr>
            <th scope="col">${item._id}</th>
            <th scope="col">${item.name}</th>
          </tr>
        `);
    student_list.innerHTML = html;
}
search_input?.addEventListener("input", (event) => {
    const target = event.target;
    handleSearch(target.value);
});
render(students);
//# sourceMappingURL=form.js.map