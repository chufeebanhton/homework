function bnrSr(arr: number[], target: number): number | undefined{
    let left: number = 0;
    let right: number = arr.length - 1;
    let n = 0;
    while (left <= right) {
        n ++;
        const mid = Math.floor(left + (right - left) / 2);
        if (arr[mid] === target) {
            console.log(target, 'Has been founded');
            console.log('At position', mid);
            console.log('O(N) = ', n)
            return arr[mid];
        } if (arr[mid] > target) right = mid - 1
                else left = mid + 1
    }
}

const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

console.log(bnrSr(array, 12));