import React, { Component } from "react";

class StationList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      busStation: []
    };
  }

  render() {
    return (
      <>
        <section className="content make_ai">
          <h1 className="title">설정</h1>
          <ul className="user_support_type">
            <li>
              <button
                type="button"
                onClick={this.level_next.bind(this, 1)}
                className={this.state.level == 1 ? "selected" : null}
              >
                회원정보 수정
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={this.level_next.bind(this, 2)}
                className={this.state.level == 2 ? "selected" : null}
              >
                알림설정
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={this.level_next.bind(this, 3)}
                className={this.state.level == 3 ? "selected" : null}
              >
                휴지통
              </button>
            </li>
          </ul>
        </section>
      </>
    );
  }
}
export default StationList;
