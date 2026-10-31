import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditSalesAutomationTab from "./EditSalesAutomationTab";
import EditProductSale from "./EditProductSale";
import EditTotalTab from "./EditTotalTab";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addImageName, imageUrl } from "@/app/features/imageSlice";
import { EditFormTotalTabData, EditProducts, EditTitle, setId } from "@/app/features/MedicalEditSlice";
import { baseUrl } from "@/baseUrl";

const tabsContent = [
    { titleValue: "Sales Automation", component: EditSalesAutomationTab },
    { titleValue: "Product Sale", component: EditProductSale },
    { titleValue: "Total", component: EditTotalTab },
];

const EditPage = () => {

    const { image } = useSelector((state) => state.image);
    const { Edittitle, Editproducts, EditformTotalTabData, id } = useSelector(state => state.EditMedicalSlice);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // State to store the URL of the preview image
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file); // Store the selected file
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                dispatch(imageUrl(reader.result));
                dispatch(addImageName(file.name));
                // setPreviewImage(reader.result); // Set the URL of the preview image
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null); // Clear the preview image if no file is selected
        }
        console.log("image", image)
    };
    const { reportId } = useParams();

    const getReports = async () => {
        try {
            const url = `${baseUrl}api/v1/medical/get-a-report/${reportId}`;
            const res = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            // setData([res?.data?.data] || []);
            console.log(res?.data?.data);
            let data = res?.data?.data
            let { netAmount, discount, remark, Total, 'amount in words': amountInWords, product, ...rest } = data
            let { _id, __v, ...restData } = rest
            console.log(product, restData, { netAmount, discount, remark, Total, amountInWords })
            dispatch(EditProducts(product));
            dispatch(setId(_id));
            dispatch(EditTitle(restData));
            dispatch(EditFormTotalTabData({ netAmount, discount, remark, Total, amountInWords }));

        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

    useEffect(() => {
        getReports();
    }, []);

    const handleEdit = async () => {
        // console.log(Edittitle,Editproducts,EditformTotalTabData);
        let { amountInWords, ...rest } = EditformTotalTabData
        console.log("rest",rest);
        let data = { ...Edittitle, product: [...Editproducts], "amount in words": amountInWords, ...rest };
        console.log(data)

        const url = `${baseUrl}api/v1/medical/update/medical-report`;
        let apiData = {
            id,
            data,
        }
        console.log(apiData)
        const res = await axios.put(
            url,
            apiData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );

        getReports();
        toast.success("report edited successfully");
    }

    return (
        <>
            <div>

                <label htmlFor="imageUpload" className="mr-3">
                    Browse Image :
                </label>
                <input
                    type="file"
                    id="imageUpload"
                    name="imageUpload"
                    onChange={handleFileChange}
                />
            </div>
            <div className="w-[99%] bg-gray-300">
                <Tabs defaultValue="Sales Automation">
                    <TabsList>
                        {tabsContent.map((tab) => (
                            <TabsTrigger key={tab.titleValue} value={tab.titleValue}>
                                {tab.titleValue}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {tabsContent.map((tab) => (
                        <TabsContent key={tab.titleValue} value={tab.titleValue}>
                            <tab.component
                            />
                        </TabsContent>
                    ))}
                </Tabs>
                <div className="flex mt-2 gap-10 justify-end">
                    <Button size="sm" className='h-8' onClick={handleEdit}>
                        Edit
                    </Button>
                </div>
            </div>
            <div className="h-44 w-full overflow-scroll  p-2">
                <img src={image} alt="report image" className="w-[100%]" />
            </div>
            <ToastContainer />
        </>
    );
};

export default EditPage;