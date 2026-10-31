import { EditProducts } from '@/app/features/MedicalEditSlice';
import React from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
const productsDetails = [
    { productName: "Pooka Lehyam", rate: "7.67", productNo: 1 },
    { productName: "Vellulli Lehyam", rate: "9.947", productNo: 2 },
    { productName: "Kesaroop Hair Oil 100 ml", rate: "4.44", productNo: 3 },
    { productName: "Sallaki-Tablets 400 mg", rate: "7.09", productNo: 4 },
    { productName: "Diabo Capsules 500 mg", rate: "2.97", productNo: 5 },
    { productName: "Trazodone", rate: "26.67", productNo: 6 },
    { productName: "Nitrazepam", rate: "28.89", productNo: 7 },
    { productName: "Lunesta", rate: "33.33", productNo: 8 },
    { productName: "Sonata", rate: "53.33", productNo: 9 },
    { productName: "Ambien", rate: "49.82", productNo: 10 },
    { productName: "Herbal Ambien", rate: "75.56", productNo: 11 },
    { productName: "Temazepam", rate: "27.78", productNo: 12 },
    { productName: "Trazodone Hcl 25 mg", rate: "2.54", productNo: 13 },
    { productName: "Trazodone Hcl 50 mg", rate: "4.2", productNo: 14 },
    { productName: "Pankaja Kasthuri 400 gm", rate: "210", productNo: 15 },
    { productName: "REVIG CAPS", rate: "44.44", productNo: 16 },
    { productName: "DIATEA", rate: "38.89", productNo: 17 },
    { productName: "Pacchjeerakagudam", rate: "61.11", productNo: 18 },
    { productName: "Deepam Kesathali", rate: "66.67", productNo: 19 },
    { productName: "Hridayasanthi", rate: "55.56", productNo: 20 },

];

const EditProductSale = () => {

    const { Editproducts } = useSelector(state => state.EditMedicalSlice);
    console.log(Editproducts)
    const [selectedProduct, setSelectedProduct] = useState({

        productNo: "",
        productName: "",
        rate: "",
    });

    const dispatch = useDispatch()

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newProducts = Editproducts.map((product, i) => {
            if (i === index) {
                return { ...product, [name]: value };
            }
            return product;
        });

        if (name === "productNo") {
            const productDetail = productsDetails.find(product => product.productNo === parseInt(value));
            if (productDetail) {
                newProducts[index].productName = productDetail.productName;
                newProducts[index].rate = productDetail.rate;
                setSelectedProduct(productDetail);
            } else {
                newProducts[index].productName = "";
                newProducts[index].rate = "";

            }
        }

        if (name === "qty" && !isNaN(value)) {
            newProducts[index].qty = value;
            // Dispatch any action if needed
            console.log(newProducts)
        }

        dispatch(EditProducts(newProducts))
        // setProducts(newProducts);
    };
    return (
        <>
            <div className="p-4">
                <form >
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">No</th>
                                <th className="px-4 py-2">Product No.</th>
                                <th className="px-4 py-2">Qty</th>
                                <th className="px-4 py-2">Product Name</th>
                                <th className="px-4 py-2">Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Editproducts.map((product, index) => (
                                <tr key={index}>
                                    <td className=" px-4 py-2">{index + 1}</td>
                                    <td className=" px-4 py-2">
                                        <input
                                            type="text"
                                            name="productNo"
                                            value={product.productNo}
                                            onChange={(e) => handleInputChange(index, e)}
                                            className="w-full"
                                        />
                                    </td>
                                    <td className=" px-4 py-2">
                                        <input
                                            type="text"
                                            name="qty"
                                            value={product.qty}
                                            onChange={(e) => handleInputChange(index, e)}
                                            className="w-full"
                                        />
                                    </td>
                                    <td className=" px-4 py-2">
                                        <input
                                            type="text"
                                            name="productName"
                                            value={product.productName}
                                            readOnly // To prevent manual input
                                            className="w-full"
                                        />
                                    </td>
                                    <td className=" px-4 py-2">
                                        <input
                                            type="text"
                                            name="rate"
                                            value={product.rate}
                                            readOnly // To prevent manual input
                                            className="w-full"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </form>
            </div>
        </>
    )
}

export default EditProductSale