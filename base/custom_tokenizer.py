from spacy.language import Language
from spacy.tokens import Doc

@Language.factory("custom_tokenizer")
def create_custom_tokenizer(nlp: Language, name: str):
    return CustomTokenizer(nlp.vocab)

class CustomTokenizer:
    def __init__(self, vocab):
        self.vocab = vocab

    def __call__(self, text):
        if isinstance(text, Doc):
            return text
        elif isinstance(text, str):
            words = text.split()
            return Doc(self.vocab, words=words)
        else:
            raise ValueError("Input must be a string or a Doc object")

    def to_disk(self, path, **kwargs):
        pass

    def from_disk(self, path, **kwargs):
        return self