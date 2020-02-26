import React from 'react'
import Tab from 'react-bootstrap/Tab'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import TH_Sep12 from './Notes/A_TH_Sep12'
import SUN_Sep15 from './Notes/B_SUN_Sep15'
import TH_Sep19 from './Notes/C_TH_Sep19'
import SUN_Sep22 from './Notes/D_SUN_Sep22'
import TH_Sep26 from './Notes/E_TH_Sep26'
import SUN_Sep29 from './Notes/F_SUN_Sep29'
import G_TH_Oct3 from './Notes/G_TH_Oct3'
import H_SUN_Oct6 from './Notes/H_SUN_Oct6'
import I_TH_Oct10 from './Notes/I_TH_Oct10'
import J_SUN_Oct13 from './Notes/J_SUN_Oct13'
import K_TH_Oct17 from './Notes/K_TH_Oct17'
import L_SUN_Oct20 from './Notes/L_SUN_Oct20'
import M_TH_Oct24 from './Notes/M_TH_Oct24'
import N_SUN_Oct27 from './Notes/N_SUN_Oct27'
import O_TH_Oct31 from './Notes/O_TH_Oct31'
import P_SUN_Nov3 from './Notes/P_SUN_Nov3'
import Q_TH_Nov7 from './Notes/Q_TH_Nov7'
import R_SUN_Nov10 from './Notes/R_SUN_Nov10'


const Meeting_Notes = () => {
  return (
    <div>
      <h1 style={{textAlign: "center"}}>Meeting Notes</h1>
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="1">Thursday, September 12</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="2">Sunday, September 15</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="3">Thursday, September 19</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="4">Sunday, September 22</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="5">Thursday, September 26</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <   Nav.Link eventKey="6">Sunday, September 29</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="7">Thursday, October 3</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="8">Sunday, October 6</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="9">Thursday, October 10</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="10">Sunday, October 13</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="11">Thursday, October 17</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="12">Sunday, October 20</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="13">Thursday, October 24</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="14">Sunday, October 27</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="15">Thursday, October 31</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="16">Sunday, November 3</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="17">Thursday, November 7</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="18">Sunday, November 10</Nav.Link>
              </Nav.Item>

            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="1">
                <TH_Sep12/>
              </Tab.Pane>
              <Tab.Pane eventKey="2">
                <SUN_Sep15/>
              </Tab.Pane>
              <Tab.Pane eventKey="3">
                <TH_Sep19/>
              </Tab.Pane>
              <Tab.Pane eventKey="4">
                <SUN_Sep22/>
              </Tab.Pane>
              <Tab.Pane eventKey="5">
                <TH_Sep26/>
              </Tab.Pane>
              <Tab.Pane eventKey="6">
                <SUN_Sep29/>
              </Tab.Pane>
              <Tab.Pane eventKey="7">
                <G_TH_Oct3/>
              </Tab.Pane>
              <Tab.Pane eventKey="8">
                <H_SUN_Oct6/>
              </Tab.Pane>
              <Tab.Pane eventKey="9">
                <I_TH_Oct10/>
              </Tab.Pane>
              <Tab.Pane eventKey="10">
                <J_SUN_Oct13/>
              </Tab.Pane>
              <Tab.Pane eventKey="11">
                <K_TH_Oct17/>
              </Tab.Pane>
              <Tab.Pane eventKey="12">
                <L_SUN_Oct20/>
              </Tab.Pane>
              <Tab.Pane eventKey="13">
                <M_TH_Oct24/>
              </Tab.Pane>
              <Tab.Pane eventKey="14">
                <N_SUN_Oct27/>
              </Tab.Pane>
              <Tab.Pane eventKey="15">
                <O_TH_Oct31/>
              </Tab.Pane>
              <Tab.Pane eventKey="16">
                <P_SUN_Nov3/>
              </Tab.Pane>
              <Tab.Pane eventKey="17">
                <Q_TH_Nov7/>
              </Tab.Pane>
              <Tab.Pane eventKey="18">
                <R_SUN_Nov10/>
              </Tab.Pane>

            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

    </div>
  )
};

export default Meeting_Notes