import { fnapp, fnstate, h } from 'https://cdn.jsdelivr.net/npm/fntags@0.3.2/src/fntags.min.js'

let data = fnstate( [], d => d.id )

function random( max ) { return Math.round( Math.random() * 1000 ) % max }

const A = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean',
    'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive',
    'cheap', 'expensive', 'fancy']
const C = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange']
const N = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse',
    'keyboard']

let nextId = 1

function buildData( count ) {
    const newData = new Array( count )
    for( let i = 0; i < count; i++ ) {
        newData[ i ] = {
            id: nextId++,
            label: `${A[ random( A.length ) ]} ${C[ random( C.length ) ]} ${N[ random( N.length ) ]}`
        }
    }
    return newData
}

const Button = ( id, title, onclick ) =>
    h( 'div', { class: 'col-sm-6 smallpad' },
       h( 'button', { id, type: 'button', class: 'btn btn-primary btn-block', onclick: onclick }, title )
    )

const row = ( item ) => {
    const id = h( 'td', {
                      class: 'col-md-1'
                  },
                  item().id
    )
    let currentLabel = item().label
    let label = h( 'a', item().label )
    let removeBtn = h( 'span', {
        onclick: ( e ) => {
            e.preventDefault()
            e.stopPropagation()
            data( data().filter( d => d().id !== item().id ) )
        },
        class: 'glyphicon glyphicon-remove', 'aria-hidden': 'true'
    } )

    let isSelected = item().selected
    const tr = h( 'tr', {
                      id: item().id,
                      class: isSelected ? 'danger' : '',
                      onclick: () => {
                          let currentSelection = data().find( d => d().selected )
                          if( currentSelection ) currentSelection.patch( { selected: false } )
                          item.patch( { selected: true } )
                      }
                  },
                  id,
                  h( 'td', { class: 'col-md-4' }, label ),
                  h( 'td', { class: 'col-md-1' },
                     h( 'a',
                        removeBtn
                     )
                  ),
                  h( 'td', { class: 'col-md-6' } )
    )

    item.subscribe( () => {
        if( isSelected && !item().selected ) {
            tr.className = ''
        } else if( !isSelected && item().selected ) {
            tr.className = 'danger'
        }
        isSelected = item().selected

        if( currentLabel != item().label ) {
            label.innerText = item().label
            currentLabel = item().label
        }
    } )

    return tr
}

fnapp( document.body,
       h( 'div', { class: 'container' },
          h( 'div', { class: 'jumbotron' },
             h( 'div', { class: 'row' },
                h( 'div', { class: 'col-md-6' },
                   h( 'h1', 'fntags keyed' )
                ),
                h( 'div', { class: 'col-md-6' },
                   h( 'div', { class: 'row' },
                      Button( 'run', 'Create 1,000 rows', () => data( buildData( 1000 ) ) ),
                      Button( 'runlots', 'Create 10,000 rows', () => data( buildData( 10000 ) ) ),
                      Button( 'add', 'Append 1,000 rows', () => data( data().concat( buildData( 1000 ) ) ) ),
                      Button( 'update', 'Update every 10th row', () => {
                          for( let i = 0; i < data().length; i += 10 ) {
                              data()[ i ].patch( { label: data()[ i ]().label + ' !!!' } )
                          }
                      } ),
                      Button( 'clear', 'Clear', () => data( [] ) ),
                      Button( 'swaprows', 'Swap Rows', () => {
                          const d = data()
                          if( d.length > 998 ) {
                              const a = d[ 1 ]
                              d[ 1 ] = d[ 998 ]
                              d[ 998 ] = a
                          }
                          data( d )
                      } )
                   )
                )
             )
          )
       ),
       h( 'table', { class: 'table table-hover table-striped test-data' },
          data.bindValues( h( 'tbody' ), row )
       ),
       h( 'span', { class: 'preloadicon glyphicon glyphicon-remove', 'aria-hidden': 'true' } )
)