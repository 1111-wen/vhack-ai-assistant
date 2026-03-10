import streamlit as st

st.title("Hackathon AI Assistant")

name = st.text_input("Enter your name")

if name:
    st.write("Hello", name)