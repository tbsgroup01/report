export function calculateTotalAmount(products) {
    let totalAmount = 0;

    // Iterate through each product
    products.forEach(product => {
        if (Number(product.productNo) > 0) {
            const rate = parseFloat(product.rate);
            const quantity = parseInt(product.qty);

            // Calculate the amount for the current product and add it to the total
            const amount = rate * quantity;
            totalAmount += amount;
        }
    });

    console

    return (totalAmount);
}


export function calculateNetAmount(totalAmount, discount) {
    // Convert discount to a percentage value
    const discountPercentage = parseFloat(discount) / 100;

    // Calculate the discount amount
    const discountAmount = totalAmount * discountPercentage;

    // Calculate the net amount after applying the discount
    const netAmount = totalAmount - discountAmount;

    return netAmount;
}

// export function numberToWords(number) {
//     const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
//     const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
//     const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
//     const scales = ['', 'thousand', 'million', 'billion', 'trillion'];

//     if (number === 0) return 'zero';

//     const numberParts = number.toString().split('.');
//     let integerPart = parseInt(numberParts[0], 10);
//     const decimalPart = parseInt(numberParts[1], 10) || 0;

//     let integerWords = '';
//     let decimalWords = '';

//     // Convert integer part to words
//     let chunkCount = 0;
//     while (integerPart > 0) {
//         const chunk = integerPart % 1000;
//         if (chunk !== 0) {
//             let chunkWords = '';

//             const hundredsDigit = Math.floor(chunk / 100);
//             const tensDigit = Math.floor((chunk % 100) / 10);
//             const onesDigit = chunk % 10;

//             if (hundredsDigit !== 0) {
//                 chunkWords += ones[hundredsDigit] + ' hundred';
//                 if (tensDigit !== 0 || onesDigit !== 0) {
//                     chunkWords += ' and ';
//                 }
//             }

//             if (tensDigit === 1) {
//                 chunkWords += teens[onesDigit];
//             } else {
//                 if (tensDigit !== 0) {
//                     chunkWords += tens[tensDigit];
//                 }
//                 if (onesDigit !== 0) {
//                     chunkWords += (tensDigit !== 0 ? '-' : '') + ones[onesDigit];
//                 }
//             }

//             chunkWords += ' ' + scales[chunkCount];
//             integerWords = chunkWords + ' ' + integerWords;
//         }

//         integerPart = Math.floor(integerPart / 1000);
//         chunkCount++;
//     }

//     // Convert decimal part to words
//     if (decimalPart !== 0) {
//         decimalWords += ' point';
//         decimalPart.toString().split('').forEach(digit => {
//             decimalWords += ' ' + ones[parseInt(digit, 10)];
//         });
//     }

//     return (integerWords + decimalWords).trim();
// }

export function numberToWords(number) {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const scales = ['', 'thousand', 'million', 'billion', 'trillion'];

    // Convert number to string if it's not already
    const numberString = typeof number === 'number' ? number.toString() : number;

    if (numberString === '0') return 'zero';

    // Splitting the number into integer and decimal parts
    const [integerPart, decimalPart] = numberString.includes('.') ? numberString.split('.') : [numberString, ''];

    let integerWords = '';
    let decimalWords = '';

    // Convert integer part to words
    if (integerPart > 0) {
        let chunkCount = 0;
        let intPart = parseInt(integerPart, 10);
        while (intPart > 0) {
            const chunk = intPart % 1000;
            if (chunk !== 0) {
                let chunkWords = '';

                const hundredsDigit = Math.floor(chunk / 100);
                const tensDigit = Math.floor((chunk % 100) / 10);
                const onesDigit = chunk % 10;

                if (hundredsDigit !== 0) {
                    chunkWords += ones[hundredsDigit] + ' hundred';
                    if (tensDigit !== 0 || onesDigit !== 0) {
                        chunkWords += ' and ';
                    }
                }

                if (tensDigit === 1) {
                    chunkWords += teens[onesDigit];
                } else {
                    if (tensDigit !== 0) {
                        chunkWords += tens[tensDigit];
                    }
                    if (onesDigit !== 0) {
                        chunkWords += (tensDigit !== 0 ? '-' : '') + ones[onesDigit];
                    }
                }

                chunkWords += ' ' + scales[chunkCount];
                integerWords = chunkWords + ' ' + integerWords;
            }

            intPart = Math.floor(intPart / 1000);
            chunkCount++;
        }
    } else {
        integerWords = 'zero';
    }

    // Convert decimal part to words
    if (decimalPart !== '') {
        const firstTwoDigits = decimalPart.slice(0, 2);
        if (firstTwoDigits !== '') {
            decimalWords = firstTwoDigits;
            if (firstTwoDigits.charAt(0) === '0') {
                decimalWords = ones[firstTwoDigits.charAt(1)];
            } else if (firstTwoDigits.charAt(0) === '1') {
                decimalWords = teens[firstTwoDigits.charAt(1)];
            } else {
                decimalWords = tens[firstTwoDigits.charAt(0)] + ' ' + ones[firstTwoDigits.charAt(1)];
            }
        } else {
            decimalWords = 'zero';
        }
    } else {
        decimalWords = 'zero';
    }

    return `${integerWords.trim()} dollar${integerWords.trim() === 'one' ? '' : 's'} and ${decimalWords.trim()} cent${decimalWords.trim() === 'one' ? '' : 's'}`;
}










export function getCurrentDate() {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();

    return `${day}-${month}-${year}`;
}
// Example usage:
// const number = 56789;
// const words = numberToWords(number);
// console.log(words);


// // Example usage:
// const totalAmount = 100; // Example total amount
// const discount = 10; // Example discount percentage

// const netAmount = calculateNetAmount(totalAmount, discount);
// console.log("Net amount:", netAmount);

// // Example usage:
// const products = [
//     { productName: "nike", rate: "2.21", quantity: "4", serialNo: 1 },
//     { productName: "nike", rate: "2", quantity: "4", serialNo: 2 }
// ];

// const total = calculateTotalAmount(products);
// console.log("Total amount:", total);
