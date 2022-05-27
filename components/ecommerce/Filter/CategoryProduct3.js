import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { updateProductCategory } from "../../../redux/action/productFiltersAction";
import {getCategories} from "../../../rest/calls";

const CategoryProduct3 = ({ updateProductCategory }) => {
    const [categories, setCategories] = useState([]);
    const [active, setActive] = useState("");

    const router = useRouter();

    // const removeSearchTerm = () => {
    //     router.push({
    //         pathname: "/shop",
    //     });
    // };

    const selectCategory = (e, category) => {
        e.preventDefault();
        // removeSearchTerm();
        updateProductCategory(category);
        router.push(`/shop/${category}`);
    };

    useEffect(() => {
        getCategories()
            .then(res => {
                setCategories(res);
            });
    }, []);

    useEffect(() => {
        const query = router.query;
        const cat = query.category ? query.category : "";

        if (categories.length > 0 && cat) {
            setActive(cat);
            updateProductCategory(cat);
        }
    }, [categories]);

    return (
        <>
            <ul  className="category-list end">
                { !!categories.length && categories.map((cat, index) => {
                    if ((index + 1) % 2 === 0) {
                        return (
                            <li onClick={(e) => selectCategory(e, cat.slug)} key={index}>
                                <a>
                                    <img style={{width:"30px"}} src="/assets/imgs/theme/icons/pfote.webp" alt="pfote icon" />
                                    { cat.name }
                                </a>
                                {/*<span className="count">30</span>*/}
                            </li>
                        )
                    }
                })}
            </ul>
        </>
    );
};

export default connect(null, { updateProductCategory })(CategoryProduct3);
