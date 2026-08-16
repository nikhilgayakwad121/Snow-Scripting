Methods:
push() = Add element in the Array in the end.
trim() = Remove white spaces

-----------Add Elements in the Array--------------
var arr = [];
arr.push('item 1');
arr.push('item 2');
console.log(JSON.stringify(arr)); 
console.log(arr[0]);
console.log('array Started');
for(var i =0;i<arr.length;i++)
{
    console.log(arr[i]);
}


-----------Revered Array by method----------------
var num_arr = [1,2,3,4,5];
console.log(arr)
num_arr.reverse();
console.log(arr);

-------Reversed Array by loop--------------------
var original_Array = [1,2,3,4,5];
var reverse_Array= [];
console.log('original Array= '+ original_Array);
for(var i =reverse-array.length-1; i >=0 ;i++)
{
    reverse_Array.push(original_Array[i])
}
console.log('original Array= '+ reverse_Array);


--------Count frequency of character-----------
var str = "programming";
var freq = [];
for(var i =0 ;i < str.length;i++){
    var ch = str[i];
    if(str>='a' && str <='z' || str>= 'A' && str <= 'Z')
    {
        if(freq[ch]){
            freq[ch]++;// Increment count if already exists
        }
        else{
            freq[ch]=1;// Initialize count
        }
    }
}
for(var key in freq){
    console.log(key+" : "+freq[key]);
}


---------- Given two Array, find out two elements which product is 6 -----------------
var array_first = [1,2,3];
var array_second = [4,5,6];
var product= 6;
for(var i= 0; i<=array_first.length ;i++)
{
    for(var k=0 ; i<array_second.length;k++)
    {
        if(array_first[i]*array_second[k]==product)
        {
            console.log(array_first[i]+'AND'+array_second[k] +'is the two element')
        }
    }     
}

------------Sorting an Array ------------------------
var new_array= [1,3,5,7,2,3,4,5,6,9];
console.log("Array obtained is : "+new_array.sort());


--------------Union of two Array --------------------
var first_array = [1, 3, 5, 7];
var second_array = [2, 3, 4, 5, 6, 9];
var union_array = Array.from(new Set(first_array.concat(second_array))); // Combine and remove duplicates using Set
console.log("Union of arrays: " + union_array);


-------------Remove Duplicates----------------
var new_array = [1, 3, 5, 7, 2, 3, 4, 5, 6, 9];
var unique = [];
for (var i = 0; i < arr.length; i++) {
    if (unique.indexOf(arr[i]) === -1) {
            unique.push(arr[i]);
    }
}
console.log("Unique Array: " + unique);


------------Intersection of two Arrays----------------
var first_array = [1, 3, 5, 7];
var second_array = [2, 3, 4, 5, 6, 9];
var new_array = [];
for (var i = 0; i < first_array.length; i++)
{
    for (var j = 0; j < second_array.length; j++)
    {
        if (first_array[i] === second_array[j]) {
            new_array.push(first_array[i]);
        }
    }
}
console.log("Array obtained is : "+new_array);


-------------------Count and display duplicate elements in an array. Also sort them in servicenow
var arr = [5, 3, 9, 3, 5, 7, 5, 9, 1, 3];
// Step 1: Count occurrences using for loop
var counts = {};
for (var i = 0; i < arr.length; i++) {
    var val = arr[i];
    if (counts[val]) {
        counts[val] = counts[val] + 1;
    } else {
        counts[val] = 1;
    }
}
// Step 2: Extract duplicates into array
var duplicates = [];
for (var key in counts) {
    if (counts[key] > 1) {
        duplicates.push({ value: parseInt(key, 10), count: counts[key] });
    }
}
// Step 3: Sort duplicates by value using for loop (Bubble Sort style)
for (var i = 0; i < duplicates.length - 1; i++) {
    for (var j = 0; j < duplicates.length - i - 1; j++) {
        if (duplicates[j].value > duplicates[j + 1].value) {
        var temp = duplicates[j];
        duplicates[j] = duplicates[j + 1];
        duplicates[j + 1] = temp;
        }
    }
}
// Step 4: Display results using for loop
gs.print("Duplicate elements with counts:");
for (var i = 0; i < duplicates.length; i++) {
   gs.print(duplicates[i].value + " → " + duplicates[i].count + " times");
}

















