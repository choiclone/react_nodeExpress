import React, { useState, useEffect, useRef } from 'react';
import useInterval from './useInterval';
import axios from 'axios';

const BusRouteModal = (props) => {
  const { open, close, reload, header, BusRoute, routeId } = props;
  const [BusRouteList, setBusRouteList] = useState([]);
  const reloadImg = require('../images/reload.png')

  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open ? 'openModal modal' : 'modal'}>
      {open ? (
        <section>
          <header>
            <button className="Reload" onClick={reload}>
              <img src={reloadImg} width="15px" height={"15px"}></img>
            </button>
            {header}
            <button className="close" onClick={close}>
              &times;
            </button>
          </header>
          <main>
            {
              BusRoute.length !== 0 ?
                <div className='BusRouteMain'>
                  {BusRoute.map((item, key) => (
                    <ul className='BusRouteName' key={key}>
                      <li>
                        {item.stNm["_text"]}
                        <ul className='BusRouteMsg'>
                          <li>{item.arrmsg1["_text"]}</li>
                          <li>{item.arrmsg2["_text"]}</li>
                        </ul>
                      </li>
                    </ul>
                  ))}
                </div> : ""
            }
          </main>
        </section>
      ) : null}
    </div>
  );
};

export default BusRouteModal;