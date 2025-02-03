type Variety = {
    _id: string,
    plu: string,
    variety: string,
    size: string,
    aka: string,
    commodity: string
}

type Commodity = {
    name: string,
    varieties: Variety[]
}