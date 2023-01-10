import { useEffect } from 'react'
import { useState } from 'react'
import useGetCollection from '../../hooks/useGetCollection'

const MostActiveUserPage = () => {
    const {data, loading} = useGetCollection('reviews')
    const [arraysOfEmailAndCount, setArraysOfEmailAndCount] = useState(null)

    useEffect(() => {
        const arrayOfEmails = data.map((doc) => doc.user_email)

        // function to get emails and count into one array
        function foo (array) {
            let a = [],
              b = [],
              arr = [...array], // clone array so we don't change the original when using .sort()
              prev;
          
            arr.sort();
            for (let element of arr) {
              if (element !== prev) {
                a.push(element);
                b.push(1);
              }
              else ++b[b.length - 1];
              prev = element;
            }
          
            return [a, b];
        }

        const result = foo(arrayOfEmails)
        console.log('result', result)

        // function to sort the array of emails and count
        function sortArrays(arrays, comparator = (a, b) => (a > b) ? -1 : (a < b) ? 1 : 0) {
            let arrayKeys = Object.keys(arrays);
            let sortableArray = Object.values(arrays)[0];
            let indexes = Object.keys(sortableArray);
            let sortedIndexes = indexes.sort((a, b) => comparator(sortableArray[a], sortableArray[b]));
        
            let sortByIndexes = (array, sortedIndexes) => sortedIndexes.map(sortedIndex => array[sortedIndex]);
        
            if (Array.isArray(arrays)) {
                return arrayKeys.map(arrayIndex => sortByIndexes(arrays[arrayIndex], sortedIndexes));
            } else {
                let sortedArrays = {};
                arrayKeys.forEach((arrayKey) => {
                    sortedArrays[arrayKey] = sortByIndexes(arrays[arrayKey], sortedIndexes);
                });
                return sortedArrays;
            }
        }

        const re = sortArrays([result[1], result[0]])
        console.log(re)
        setArraysOfEmailAndCount(re)

    }, [data])


    return (
        <div>
            {loading && <p>loading...</p>}
            {data && (
                <>
                    <h1>Most active user</h1>

                    {arraysOfEmailAndCount && (
                        <>
                            {arraysOfEmailAndCount[1].map((i, index) => (
                                <p key={i}>{i} with {arraysOfEmailAndCount[0][index]} reviews made</p>
                            ))}
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default MostActiveUserPage
