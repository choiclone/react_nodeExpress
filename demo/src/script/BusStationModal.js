import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const BusStationModal = (props) => {
    const { open, close, detailStation, stationInfo, intervalInfo } = props;

    return (
        // 모달이 열릴때 openModal 클래스가 생성된다.
        <div className={open ? 'openModal modal' : 'modal'}>
            {open ? (
                <section>
                    <header>
                        상세보기
                        <button className="close" onClick={close}>
                            &times;
                        </button>
                    </header>
                    <DetailList>
                        {
                            // String(detailStation["nxtStn"]["_text"])
                            String(detailStation)+"방면"
                        }
                        <button onClick={() => intervalInfo(stationInfo)}>눌러</button>
                    </DetailList>
                </section>
            ) : null}
        </div>
    );
};

const DetailList = styled.main`
    color: black;
`

export default BusStationModal;