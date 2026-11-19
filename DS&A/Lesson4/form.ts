interface Student {
    _id: string, name: string
}

const students: Student[] = [
    {_id: "001", name: 'Le Trong Tuan'},
    {_id: "002", name: 'Le Trong Huy'},
    {_id: "003", name: 'Van Thi Thao Nhi'}
]

const student_list = document.getElementById('student_list');
const search_input = document.getElementById('search_input');

function debounce<T extends (...args: any[]) => void>(
    callback: T,
    delay: number
) {
    let timer: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timer);

        timer = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}



const handleSearch = debounce((keyword: string) => {
    const result = students.filter(stds => {
    return stds.name
        .split(" ")
        .some(item =>
            item.toLowerCase().startsWith(keyword.trim().toLowerCase())
        );
    });

    console.log(result);
    render(result);
}, 500);

function render(data: Student[]): void{
    let html = ``;
    data.map(item => html += `
        <tr>
            <th scope="col">${item._id}</th>
            <th scope="col">${item.name}</th>
          </tr>
        `)
    student_list!.innerHTML = html;
}

search_input?.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;

    handleSearch(target.value);
});

render(students);