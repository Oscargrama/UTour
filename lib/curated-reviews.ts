export type CuratedReview = {
  id: string
  name: string
  location: string
  rating: number
  comment: string
  tourId: string
  verified: boolean
  date: string
  source: "guruwalk"
}

export const curatedReviews: CuratedReview[] = [
  {
    id: "guruwalk-1",
    name: "Alicia",
    location: "Munich, Alemania",
    rating: 5,
    comment:
      "Oscar was super friendly. He picked us up and even brought us to the airport, as we were short in time. We saw Guatape and two other villages and could stop wherever we wanted to, which was very nice :). I would really recommend the tour!",
    tourId: "guatape-private",
    verified: true,
    date: "Dic 2025",
    source: "guruwalk",
  },
  {
    id: "guruwalk-2",
    name: "Kathleen",
    location: "Bradenton, FL, USA",
    rating: 5,
    comment:
      "Oscar was an excellent guide, good driver, proud Colombian who showed us many sources of his pride. Great experience!",
    tourId: "guatape-private",
    verified: true,
    date: "Dic 2025",
    source: "guruwalk",
  },
  {
    id: "guruwalk-3",
    name: "Alicia",
    location: "Orlando, FL, USA",
    rating: 5,
    comment:
      "Oscar was a fantastic tour guide, we highly recommended him for any tour, we enjoyed the tour so much that if we go back we will get Oscar again.",
    tourId: "guatape-private",
    verified: true,
    date: "Oct 2025",
    source: "guruwalk",
  },
]

export function getCuratedReviewsByTourId(tourId: string) {
  return curatedReviews.filter((review) => review.tourId === tourId)
}
