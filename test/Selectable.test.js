import 'should'
import $ from 'teaspoon'
import React, { Component, PropTypes } from 'react'

// import Selection from '../src/Selection.jsx'
import Selectable from '../src/Selectable.jsx'

describe("Selectable", () => {
  class Blah extends Component {
    static propTypes = {
      selected: PropTypes.bool,
      id: PropTypes.number,
      value: PropTypes.string,
      children: PropTypes.element
    }
    render() {
      return (
        <div key={this.props.id}>
          <p>hi {this.props.value} {this.props.selected ? <span>selected</span> : ''}</p>
          {this.props.children}
        </div>
      )
    }
  }

  const Blah2 = ({ selected = false, id, value, children }) => (
    <div key={id}>
      hi {value} {selected ? <span>selected</span> : ''}
      {children}
    </div>
  )

  Blah2.displayName = 'Blah2'
  Blah2.propTypes = {
    selected: PropTypes.bool,
    id: PropTypes.number,
    value: PropTypes.string,
    children: PropTypes.element
  }

  describe("higher-order container creation", () => {
    it("should make a component from a React class", () => {
      const Thing = Selectable(Blah, {
        key: (props) => props.id,
        value: (props) => props.value,
        cacheBounds: true
      })
      Thing.displayName.should.match(/Selectable\((Blah|Component)\)/)

      const stuff = $(<Thing value="me"><div className="foo">hi</div></Thing>).render(true)

      stuff.find('.foo').text().should.eql('hi')

      const nextstuff = $(<Thing value="Greg" />).render()

      nextstuff.find('p').text().should.eql('hi Greg ')
      stuff.unmount()
    })

    it("should make a reffable component from a stateless functional component", () => {
      const Thing = Selectable(Blah2, {
        key: (props) => props.id,
        value: (props) => props.value,
        cacheBounds: true
      })

      const spy = sinon.spy()

      const stuff = $(<Thing ref={spy} />).render(true)
      expect(spy.called).to.be.true
      spy.args[0][0].should.equal(stuff[0])

      stuff.unmount()
    })

    it("should error if a non-component is passed in", () => {
      expect(() => {
        Selectable(false)
      }).to.throw('Component is not a class, must be a stateful React Component class')
    })

    it("should pull displayname from displayName", () => {
      const Thing = Selectable( class {
        static displayName = 'Hi'
        render() {}
      }, {
        key: (props) => props.id,
        value: (props) => props.value,
        cacheBounds: true
      })
      Thing.displayName.should.equal('Selectable(Hi)')
    })

    it("should display the Container for a stateless functional component", () => {
      const Thing = Selectable(Blah2, {
        key: (props) => props.id,
        value: (props) => props.value,
        cacheBounds: true
      })
      Thing.displayName.should.equal('Selectable(ReferenceableContainer(Blah2))')
    })

    it("should pull displayname from name if displayName is not present", () => {
      const Thing = Selectable( class Hi {
        render() {}
      }, {
        key: (props) => props.id,
        value: (props) => props.value,
        cacheBounds: true
      })
      Thing.displayName.should.match(/^Selectable\((Hi|Component)\)$/) // IE 10/11
    })
  })

  describe("selection", () => {
    it("should set the selectable prop when selected")
  })

  describe("registration", () => {
    it("should call registerSelectable on context.selectionManager")
    it("should call options.key, options.value")
    it("should set up unregistration on unmount")
    it("should call unregistration on unmount")
  })
})
