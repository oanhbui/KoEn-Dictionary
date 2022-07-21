from nis import match
from flask import Flask
from datapackage import Package
from flask_cors import CORS

class Trie:
    END = None

    def __init__(self):
        self.trie = {}

    def add(self, word, value):
        trie = self.trie
        for c in word:
            if c not in trie:
                trie[c] = {}
            trie = trie[c]
        trie[self.END] = value

    def find_node(self, prefix):
        trie = self.trie
        for c in prefix:
            if c not in trie:
                return None
            trie = trie[c]
        return trie

    def search(self, prefix, top=20):
        trie = self.find_node(prefix)
        matches = []
        END = self.END

        def collect(trie):
            if not trie:
                return
            if len(matches) >= top:
                return
            if END in trie:
                matches.append(trie[END])
            if len(matches) >= top:
                return
            for subtrie in trie.values():
                if not isinstance(subtrie, dict):
                    continue
                collect(subtrie)

        collect(trie)
        return matches


def prepare_data():
    package = Package('https://raw.githubusercontent.com/garfieldnate/kengdic/master/datapackage.json')
    resource = package.get_resource('kengdic')
    data = resource.read(keyed=True)
    words = {}
    trie = Trie()
    for word in data:
        if not word['gloss']:
            continue
        words[word['id']] = word
        trie.add(word['gloss'], word['id'])
    return words, trie

app = Flask(__name__)
CORS(app)

words, trie = prepare_data()

@app.route("/search/<prefix>")
def search(prefix):
    matches = trie.search(prefix)
    result = [words[wid] for wid in matches]
    return {
        "success": True,
        "matches": result
    }