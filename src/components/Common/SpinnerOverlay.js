import React from 'react';
import { Spinner } from 'reactstrap';

const SpinnerOverlay = () => (
    <div className="tw-flex tw-justify-center tw-items-center tw-w-full tw-h-full tw-absolute tw-left-0 tw-top-0 tw-bg-[rgba(255,255,255,0.5)] tw-z-10">
        <Spinner />
    </div>
);

export default SpinnerOverlay;
