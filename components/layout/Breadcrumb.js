import React from "react";

import Link from "next/link"

const Breadcrumb = ({parent, sub, subChild, category, noBreadcrumb}) => {
    return (
        <>
            <div className={`page-header breadcrumb-wrap ${noBreadcrumb}`}>
                <div className="container">
                    <div className="breadcrumb">
                        <Link href="/"><a>
                            {parent}
                        </a>
                        </Link>
                        <span></span><Link href="/shop"><a>{sub}</a></Link>
                        <span></span><Link href={`/shop/${category}`}><a>{category}</a></Link>
                        <span></span> {subChild}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Breadcrumb;
