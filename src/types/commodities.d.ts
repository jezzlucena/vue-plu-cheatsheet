type Variety = {
    plu: string,
    name: string,
    size: string,
    aka?: string,
    commodity?: string,
    variety?: string
}

type Commodity = {
    name: string,
    varieties: Variety[]
}