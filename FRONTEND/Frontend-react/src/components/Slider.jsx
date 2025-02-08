/* eslint-disable camelcase */
import '../styles/slider.css'
import Card from './ui/Card'
export default function Slider ({ popularArticles }) {
  if (popularArticles.length === 0) {
    // return (<h3 className='text-center'>No existen articulos para mostrar  en el slider</h3>)
    return (<></>)
  }

  const popularNotes = [...popularArticles]
  const mainNote = popularNotes.splice(0, 1)[0]
  const topNotes = []
  let longNotes = Math.floor(popularNotes.length / 3)
  longNotes = longNotes > 3 ? 3 : longNotes
  for (let i = 0; i < longNotes; i++) {
    topNotes.push(popularNotes.splice(0, 3))
  }

  return (
    <div className="slider container mb-8 mt-4">
      {
        <>
          <h2 className="md:text-center mb-4">Los {popularArticles.length} Articulos más destacados</h2>
          <div className="container-slider">
            <div className="main-card mb-2 md:mb-0">
              <Card
                title={mainNote?.title}
                description={mainNote?.description}
                image={mainNote?.image}
                idNotaPub={mainNote?.id}
                link={mainNote?.link}
                author={mainNote?.author}
                likes={mainNote?.likes}
                comments={mainNote?.comments}
                islike={mainNote?.islike}
              />
            </div>
            <div className="main-articles flex flex-col">
              {
                topNotes.map((tNote, index) => {
                  return (
                    <section key={index} id={`section-${index}`}>
                      {
                        tNote.map(note => <Card key={note?.id}
                          title={note?.title}
                          description={note?.description}
                          image={note?.image}
                          idNotaPub={note?.id}
                          link={note?.link}
                          author={note?.author}
                          likes={note?.likes}
                          comments={note?.comments}
                          islike={note?.islike} />)
                      }
                    </section>
                  )
                })
              }
            </div>
          </div>
        </>
      }
    </div>

  )
}
