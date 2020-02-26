import React from 'react';
import Person from '../components/Person';
import {NavLink} from 'react-router-dom';
import HomepageNavbar from "../components/HomepageNavBar";
import brianImg from '../images/team/brian.jpeg'
import jeffreyImg from '../images/team/jeffrey.png'
import jianqiaoImg from '../images/team/jianqiao.png'
import malikImg from '../images/team/malik.png'
import vincentImg from '../images/team/vincent.png'
import yiyuImg from '../images/team/yiyu.jpeg'

const TeamMember = () => {
  return (
    <div className="landing-grid">
      <HomepageNavbar/>

      <div className="landing-grid">
        <div className="landing-grid">
          <Person name="Brian Nguyen" role="Team Leader"
                  biography="Currently a senior at San Francisco State University"
                  image={brianImg}
          />
        </div>
        <div className="landing-grid">
          <Person name="Vincent Wu" role="Github Master"
                  biography="I'm currently studying towards a Bachelors of Science degree in Computer Science at San Francisco State University. I strive to be a member of today's evolving society towards new technology. In order to keep up with this goal, I like to learn new languages in my free time at CodeAcademy and other tutorial sites."
                  image={vincentImg}
          />
        </div>
        <div className="landing-grid">
          <Person name="Jason Xie"
                  role="(Front-end Leader)"
                  biography="A transfer student from City College of San Francisco.
                    Currently my second year at San Francisco State University.
                    My major is Computer Science.I want to be a software engineer. I like traveling and hiking. I believe that
                    'If at first you don’t succeed, try, try again'."
                  image={jianqiaoImg}
          />
        </div>
        <div className="landing-grid">
          <Person name="Jeffrey Thomas Piercy" role="Back-End Lead"
                  biography="Currently a senior at San Francisco State University"
                  image={jeffreyImg}
          />
        </div>
        <div className="landing-grid">
          <Person name="Yiyu Zhang" role="Backend assistance"
                  biography="Currently a senior at San Francisco State University"
                  image={yiyuImg}
          />
        </div>
        <div className="landing-grid">
          <Person name="Malik Iscandari" role="Scrum Master"
                  biography="Currently a senior Computer Science student at SF State. I like tech, business, and cars!"
                  image={malikImg}
          />
        </div>

        <div className="landing-grid">
          <NavLink to="/Meeting_Notes"> Scrum meeting notes </NavLink>
        </div>
      </div>
    </div>
  );
};

export default TeamMember;
