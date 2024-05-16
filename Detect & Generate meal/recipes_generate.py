from transformers import FlaxAutoModelForSeq2SeqLM
from transformers import AutoTokenizer

MODEL_NAME_OR_PATH = "flax-community/t5-recipe-generation"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME_OR_PATH, use_fast=True)
model = FlaxAutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME_OR_PATH)
special_tokens = tokenizer.all_special_tokens

def skip_special_tokens(text, special_tokens):
    for token in special_tokens:
        text = text.replace(token, "")

    return text

def target_postprocessing(texts, special_tokens):
    tokens_map = {
        "<sep>": "--",
        "<section>": "\n"
    }
    
    if not isinstance(texts, list):
        texts = [texts]
    
    new_texts = []
    for text in texts:
        text = skip_special_tokens(text, special_tokens)

        for k, v in tokens_map.items():
            text = text.replace(k, v)

        new_texts.append(text)

    return new_texts

def generation_function(ings):
    prefix = "items: "

    # generation_kwargs = {
    #     "max_length": 512,
    #     "min_length": 64,
    #     "no_repeat_ngram_size": 3,
    #     "early_stopping": True,
    #     "num_beams": 5,
    #     "length_penalty": 1.5,
    # }
    generation_kwargs = {
        "max_length": 512,
        "min_length": 64,
        "no_repeat_ngram_size": 3,
        "do_sample": True,
        "top_k": 60,
        "top_p": 0.95
    }

    inputs = [prefix + inp for inp in ings]
    inputs = tokenizer(
        inputs, 
        max_length=256, 
        padding="max_length", 
        truncation=True, 
        return_tensors="jax"
    )

    input_ids = inputs.input_ids
    attention_mask = inputs.attention_mask

    output_ids = model.generate(
        input_ids=input_ids, 
        attention_mask=attention_mask,
        **generation_kwargs
    )
    generated = output_ids.sequences
    generated_recipe = target_postprocessing(
        tokenizer.batch_decode(generated, skip_special_tokens=False),
        special_tokens
    )
    return generated_recipe

def generate_recipe(items):
    generated = generation_function(items)
    output_list = []

    for text in generated:
        result_dict = {}
        sections = text.split("\n")
        for section in sections:
            section = section.strip()
            if section.startswith("title:"):
                section = section.replace("title:", "").strip()
                result_dict["name"] = section.capitalize()
            elif section.startswith("ingredients:"):
                section = section.replace("ingredients:", "").strip()
                ingredients_list = [info.strip().capitalize() for info in section.split("--")]
                result_dict["ingredients"] = ingredients_list
            elif section.startswith("directions:"):
                section = section.replace("directions:", "").strip()
                directions_list = [info.strip().capitalize() for info in section.split("--")]
                result_dict["instructions"] = directions_list
        
        output_list.append(result_dict)
    
    return output_list