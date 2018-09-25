### Required linux packages

```bash
# vnc
yum -y install tigervnc-server

# node
curl --silent --location https://rpm.nodesource.com/setup_10.x | sudo bash -
yum -y install nodejs

# fonts
yum -y groupinstall "Fonts"

# net-tools
yum -y install net-tools

# chromium
yum install -y epel-release
yum install -y chromium

#java
yum install -y java-1.8.0-openjdk

#sudoer
usermod -aG wheel phong
```

### Data Models

```flow js

const Person = Model({ name: String = 'Steve' })

type Suite = {
    actions: Array<Dispatcher | ScriptAssertion | ElementAssertion | PageAssertion>
}
type Dispatcher = {
    query: DOMQuery
    event: DOMEvent
}
type ScriptAssertion = {
    evaluation: String
    comparision: String
    value: String
}
type ElementAssertion = {
    query: DOMQuery
    using: Property
    value: String
    comparision: String
}
type PageAssertion = {
    using: String
    value: String
    comparision: String
}
type Property = {
    prop: String
    name: String
}
type DOMQuery = {
    id: String
    tag: String
    name: String
    text: String
    selector: String
    frame: Element
    rect: Rect
}
type DOMEvent = {
    type: String
    offset: Coordinate
    screen: Coordinate
    client: Coordinate
}
type Rect = {
    top: Number
    left: Number
    right: Number
    bottom: Number
    width: Number
    height: Number
}
type Coordinate = {
    x: Number
    y: Number
}
```