import React from 'react';
import { Container } from 'reactstrap';

// Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

const breadcrumbItems = [
    { title: 'Utility', link: '#' },
    { title: 'Starter Page', link: '#' },
];

const StarterPage = () => {
    console.log();
    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Starter Page" breadcrumbItems={breadcrumbItems} />
                </Container>
            </div>
        </>
    );
};

export default StarterPage;
